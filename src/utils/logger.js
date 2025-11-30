/**
 * Logger utility for the application
 * Provides consistent logging across the application
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const LOG_COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[90m', // Gray
  RESET: '\x1b[0m'
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    this.enableColors = process.env.NODE_ENV !== 'production';
  }

  shouldLog(level) {
    const levels = Object.keys(LOG_LEVELS);
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const color = this.enableColors ? LOG_COLORS[level] : '';
    const reset = this.enableColors ? LOG_COLORS.RESET : '';
    
    let formattedMessage = `${color}[${timestamp}] [${level}]${reset} ${message}`;
    
    if (args.length > 0) {
      formattedMessage += ' ' + args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ');
    }
    
    return formattedMessage;
  }

  error(message, ...args) {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', message, ...args));
    }
  }

  warn(message, ...args) {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', message, ...args));
    }
  }

  info(message, ...args) {
    if (this.shouldLog('INFO')) {
      console.log(this.formatMessage('INFO', message, ...args));
    }
  }

  debug(message, ...args) {
    if (this.shouldLog('DEBUG')) {
      console.log(this.formatMessage('DEBUG', message, ...args));
    }
  }

  log(message, ...args) {
    this.info(message, ...args);
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
