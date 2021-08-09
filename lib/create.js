const path = require('path')
const fs = require('fs-extra')


module.exports = async function (name, options) {
  console.log('>>> create.js', name, options)

  // 当前命令行所在的目录
  const cwd = process.cwd()

  // 需要创建的目录地址
  const targetAir = path.join(cwd, name)

  // 目录是否已经存在
  if(fs.existsSync(targetAir)){
    // 是否强制创建
    if(options.force){
      await fs.remove(targetAir)
    }else{
      //TODO 询问用户是否要覆盖
    }
  }
}