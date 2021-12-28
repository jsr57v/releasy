const fs = require('fs')
const path = require('path')
const { Octokit } = require('@octokit/rest')

class GithubReleaser {
    constructor(appName) {
        this.appName = appName
        this.packageJson = require(path.join(process.cwd(),'./package.json'))
        this.version = "v" + this.packageJson.version
        this.owner = "aplazame"
    }

    async sendRelease(releaseText) {

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
            log: {
                debug: console.log,
                error: console.log
            }
        });

        octokit.repos.createRelease({
            owner: this.owner,
            repo: this.appName,
            tag_name: this.version,
            name: this.version,
            body: releaseText
          }).then((response, error) => {
            if (error)
                return console.log(error)
            return console.log("Release realizada con éxito.")
          })
        
    }

    getReleaseText(){
        return fs.readFileSync(
            path.join(
                process.cwd(),
                'LATEST.MD'
            ), 'utf-8'
        )
    }

}

module.exports = GithubReleaser;