import chalk from "chalk";

const log = console.log;
export class Logger {
  static text(message: string) {
    log(chalk.white(message));
  }

  static info(message: string) {
    log(chalk.cyan(message));
  }
  static error(message: string) {
    log(chalk.red(message));
  }
  static success(message: string) {
    log(chalk.green(message));
  }
  static warning(message: string) {
    log(chalk.redBright(message));
  }
}
