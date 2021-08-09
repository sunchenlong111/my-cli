#! /usr/bin/env node

const { program } = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    require('../lib/create')(name, options)
  })

// 配置config命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })

// 配置UI命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port> ', 'delete used for the UI server')
  .action((value, options) => {
    console.log(value, options)
  })

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')


program.on('--help', () => {

  console.log('\r\n' + figlet.textSync('yuanlong', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
  }));

  console.log(`\r\nRun ${chalk.cyan(`YL <command> --help`)} for detailed usage of given command\r\n`)
})

program.parse(process.argv)
