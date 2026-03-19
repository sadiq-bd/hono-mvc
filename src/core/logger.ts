export class Logger {
  static info(message: string, context: Record<string, any> = {}) {
    this.log('ℹ️ INFO', '\x1b[36m', message, context); // Cyan
  }

  static success(message: string, context: Record<string, any> = {}) {
    this.log('✅ SUCCESS', '\x1b[32m', message, context); // Green
  }

  static warn(message: string, context: Record<string, any> = {}) {
    this.log('⚠️ WARN', '\x1b[33m', message, context); // Yellow
  }

  static error(message: string, context: Record<string, any> = {}, err?: any) {
    this.log('❌ ERROR', '\x1b[31m', message, context); // Red
    if (err) {
      console.error(err);
    }
  }

  static debug(message: string, context: Record<string, any> = {}) {
    this.log('🐛 DEBUG', '\x1b[35m', message, context); // Magenta
  }

  private static log(level: string, color: string, message: string, context: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length ? `\n\x1b[90m\${JSON.stringify(context, null, 2)}\x1b[0m` : '';
    
    // Format: [2024-03-X] LEVEL: Message
    console.log(`\x1b[90m[\${timestamp}]\x1b[0m \${color}\${level}\x1b[0m: \${message}\${contextStr}`);
  }
}
