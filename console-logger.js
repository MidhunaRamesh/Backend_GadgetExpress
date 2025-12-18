// Enhanced console logging utility
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const logger = {
  info: (message, data = null) => {
    console.log(`${colors.blue}ℹ️  INFO:${colors.reset} ${message}`);
    if (data) console.log(data);
  },
  
  success: (message, data = null) => {
    console.log(`${colors.green}✅ SUCCESS:${colors.reset} ${message}`);
    if (data) console.log(data);
  },
  
  error: (message, error = null) => {
    console.log(`${colors.red}❌ ERROR:${colors.reset} ${message}`);
    if (error) console.log(error);
  },
  
  warning: (message, data = null) => {
    console.log(`${colors.yellow}⚠️  WARNING:${colors.reset} ${message}`);
    if (data) console.log(data);
  },
  
  request: (method, path, body = null) => {
    console.log(`\n${colors.cyan}🌐 ${method} ${path}${colors.reset}`);
    console.log(`${colors.magenta}📅 Time:${colors.reset} ${new Date().toLocaleString()}`);
    if (body && Object.keys(body).length > 0) {
      console.log(`${colors.magenta}📦 Body:${colors.reset}`, body);
    }
  },
  
  database: (action, collection, data = null) => {
    console.log(`${colors.yellow}💾 DATABASE ${action.toUpperCase()}:${colors.reset} ${collection}`);
    if (data) console.log(data);
  }
};

module.exports = logger;