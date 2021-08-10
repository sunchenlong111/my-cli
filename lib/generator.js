const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用ora初始化，传入提示信息 message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入方法
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('Request failed, refetch ...')
  }
}
class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name
    // 目录创建的位置
    this.targetDir = targetDir
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }


  //获取用户选择的模版
  // 1. 从远程拉取模版
  // 2. 用户选择自己新下载的模版名称
  // 3. return 用户选择的名称
  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
    if (!repoList) return
    // 找出所有模版名称
    const repos = repoList.map(item => item.name)
    // 找出用户选择的模版
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })
    return repo
  }

  // 获取版本信息
  async getTag(repo) {
    const tagList = await wrapLoading(getTagList, 'waiting fetch tag', repo)
    if (!tagList) return
    // 找出所有tag
    const tags = tagList.map(item => item.name)
    // 找出用户选择的模版
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'Please choose a tag to create project'
    })
    return tag
  }

  // 下载远程模版
  async download(repo, tag) {

    const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`

    await wrapLoading(this.downloadGitRepo, 'waiting download template', requestUrl, this.targetDir)

  }


  // 核心创建逻辑
  // 1.获取模版名称
  // 2. 获取tag名称
  // 3. 下载模版到目录
  async create() {

    // 获取模版名称
    const repo = await this.getRepo()
    console.log('用户选择了，repo=' + repo)

    // 获取tag名称
    const tag = await this.getTag(repo)
    console.log('用户选择了，tag=' + tag)

     //下载模板到模板目录
     await this.download(repo, tag)

  }
}

module.exports = Generator