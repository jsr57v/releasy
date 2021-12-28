const ch = require('child_process');
const { promisify } = require('util');

const execShell = promisify(ch.exec)

class GitScraper {

    constructor() {
        this.commitIntervalArray = [];
        this.commitIntervalHistory = [];
        this.versionName = null;
    }

    static async getTags (options = {}) {
        const { last = null, abbref = null, sortBy = null } = options

        const { stdout } = await execShell(
            'git show-ref'
                + (abbref > 0 ? ` --abbref= ${abbref}` : '')
                + (last > 0 ? ` | tail -${last}` : '')
        );

        const tags = stdout.split('\n')
            .map( (line) => {
                const [, hash, version] = line.match(/(.*)\srefs\/tags\/(.*)/) || []
                if (!hash) return null

                return { 
                    hash,
                    version: version.indexOf("v") !== 0 
                        ?  "v" + version
                        : version

                  }
            })
            .filter(line => line)

        return sortBy
            ? tags.sort( (a, b) => sortBy(a, b) )
            : tags
    }

    async getMainTags() {
        const { stdout } = await execShell('git tag --sort=v:refname')
        let orderedTags = stdout.split("\n").filter(tag => tag.length > 0).reverse()
        const tags = [orderedTags[1], orderedTags[0]]
        // console.log(tags)
        const parsedTag_1 = await execShell(`git show-ref -s ${tags[0]}`)
        const parsedTag_2 = await execShell(`git show-ref -s ${tags[1]}`)
        const firstVersionHash = parsedTag_1.stdout.replace("\n", "");
        const secondVersionHash = parsedTag_2.stdout.replace("\n","");
        this.commitIntervalArray = [{
            commitHash: firstVersionHash,
            version: tags[0]
        }, {
            commitHash: secondVersionHash,
            version: tags[1]
        }]
        //console.log(this.commitIntervalArray)
        this.versionName = this.commitIntervalArray[1]['version']
        return this.commitIntervalArray
    }

    async parseCommitIntervalHistory(lastRevision) {
        await this.getMainTags()
        let command = `git log ${lastRevision}...${this.commitIntervalArray[0]['version']} --pretty=format:'%H [--] %s'`;
        const { stdout } = await execShell(command)
        // console.log(command)
        const intervalGitLogCleanedStdout = this.stdoutToCleanedArray(stdout, 'here');
        this.commitIntervalHistory = intervalGitLogCleanedStdout.map(
            (commit) => {
                const splittedCommit = commit.split("[--]")
                return {
                    commitHash: splittedCommit[0].replace(" ",""),
                    message: splittedCommit[1].replace(" ","")
                }
            }
        )
        return this.commitIntervalHistory;

    }

    async parseCleanedReleaseCommitHistory(options = {}) {
        const { bumpMode = false } = options
        await ( bumpMode ? this.getMainTags()[1] : this.getMainTags() );

        await this.parseCommitIntervalHistory(
            bumpMode ? "HEAD" : this.commitIntervalArray[1]['version']
        );
    }

    stdoutToCleanedArray(stdout, call) {
        return stdout
            .split("\n")
            .filter((commit) => commit.length > 0);
    }
}


module.exports = GitScraper;