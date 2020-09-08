module.exports = {
  // Applications part
  apps: [{
    name: 'gmkit-bank',
    script: 'app.js',
    env: {
      COMMON_VARIABLE: 'true'
    },
    // Environment variables injected when starting with --env production
    // http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  // Deployment part
  // Here you describe each environment
  deploy: {
    production: {
      user: 'ubuntu',
      // Multi host is possible, just by passing IPs/hostname as an array
      host: 'ec2-13-127-76-200.ap-south-1.compute.amazonaws.com',
      // Branch
      ref: 'origin/master',
      // Key
      key: 'gmkit-bank.pem',
      // Git repository to clone
      repo: 'git@github.com:hemantvayali009/gkmit-bank.git',
      // Path of the application on target servers
      path: '/home/ubuntu/production',
      // Can be used to give options in the format used in the configura-
      // tion file.  This is useful for specifying options for which there
      // is no separate command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: 'StrictHostKeyChecking=no',
      // To prepare the host by installing required software (eg: git)
      // even before the setup process starts
      // can be multiple commands separated by the character ';'
      // or path to a script on your local machine
      'pre-setup': 'sudo apt-get install git',
      // Commands / path to a script on the host machine
      // This will be executed on the host after cloning the repository
      // eg: placing configurations in the shared dir etc
      'post-setup': 'ls -la',
      // Commands to execute locally (on the same machine you deploy things)
      // Can be multiple commands separated by the character ';'
      'pre-deploy-local': 'echo "This is a local executed command"',
      // Commands to be executed on the server after the repo has been cloned
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production',
      // Environment variables that must be injected in all applications on this env
      env: {
        NODE_ENV: 'production'
      }
    },
    staging: {
      user: 'ubuntu',
      host: 'ec2-13-127-76-200.ap-south-1.compute.amazonaws.com',
      ref: 'origin/master',
      repo: 'git@github.com:hemantvayali009/gkmit-bank.git',
      path: '/home/ubuntu/development',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};
