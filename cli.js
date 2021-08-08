#! /usr/bin/env node

const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Your name',
    default: 'my-cli'
  }
]).then(answers => {
  // 模版文件目录
  const destUrl = path.join(__dirname, 'templates')
  // process.cwd() 对应控制台所在目录
  const cwdUrl = process.cwd()

  fs.readdir(destUrl, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      ejs.renderFile(path.join(destUrl, file), answers).then(data => {
        fs.writeFileSync(path.join(cwdUrl, file), data)
      })
    })
  })
})