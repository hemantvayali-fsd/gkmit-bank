module.exports = {
  apps: [{
    name: 'gmkit-bank',
    script: 'app.js',
    watch: '.'
  }],
  deploy: {
    production: {
      key: 'gmkit-bank.pem',
      user: 'ubuntu',
      host: 'ec2-13-127-76-200.ap-south-1.compute.amazonaws.com',
      ref: 'origin/master',
      repo: 'git@github.com:hemantvayali009/gkmit-bank.git',
      path: '/home/ubuntu/',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
