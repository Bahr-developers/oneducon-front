export default {
  apps: [{
    name: 'frontend',
    script: 'serve',
    args: '-s dist -l 3000',
    cwd: '/var/www/onedukon/front',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};