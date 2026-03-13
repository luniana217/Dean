console.log("javascript")

import { Command } from 'commander';
import {add, list} from './cmd.js';

const program = new Command();

program
    .command('add') 
    .argument('<a>')
    .argument('<b>')
    .description('메모 추가')
    .action(add);

    program
    .command('list') //프로그램 이름
    .description('리스트')
    .action(list);

program.parse(process.argv)