/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring  */
const path = require('path');
const readLine = require('linebyline');
const fs = require('fs');
const yargs = require('yargs');

const exe = () => {
  // Command line argument setup.
  const argv = yargs
    .option('out', {
      alias: 'o',
      description: 'The output csv filename. Required',
      type: 'string',
    })
    .option('in', {
      alias: 'i',
      description: 'The directory to scan. Required',
      type: 'string',
    })
    .option('scopeIdentity', {
      alias: 'si',
      description: 'Detect scope_identity',
      type: 'boolean',
    })
    .option('selectTop', {
      alias: 'st',
      description: 'Detect select top',
      type: 'boolean',
    })
    .option('cfform', {
      alias: 'cff',
      description: 'Detect cfform',
      type: 'boolean',
    })
    .option('getDate', {
      alias: 'gd',
      description: 'Detect getDate',
      type: 'boolean',
    })
    .help() // Enable help
    .alias('help', 'h') // Make an alias -h for help
    .argv; // Save input args as argv for use in the script

  /** Retrieve file paths from a given folder and its subfolders. */
  const getFilePaths = (folderPath) => {
    const entryPaths = fs.readdirSync(folderPath).map(entry => path.join(folderPath, entry));
    const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
    const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
    const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(getFilePaths(curr)), []);
    return [...filePaths, ...dirFiles];
  };

  if (!argv.out || !argv.in) {
    console.error('You must provide an input and output file');
    console.error('Run --h for more details.');
    process.exit();
  }

  console.log(`Scanning ${argv.in}`);

  const allFiles = getFilePaths(argv.in);

  fs.writeFile(argv.out, 'usage_type,file_name,line_num\n', () => null);

  allFiles.forEach((file) => {
    if (
      file.toString().toLowerCase().includes('.cfm')
      || file.toString().toLowerCase().includes('.cfc')
    ) {
      console.log(`Scanning ${file}`);
      const rl = readLine(file);
      rl.on('line', (line, lineNum) => {
        if (
          argv.scopeIdentity
          && line
            .toLowerCase()
            .includes('scope_identity')
        ) {
          fs.appendFileSync(argv.out, `scope_identity,${file},${lineNum}\n`);
        }
        if (
          argv.selectTop
          && line.toString()
            .toLowerCase()
            .includes('select top')
        ) {
          fs.appendFileSync(argv.out, `select_top,${file},${lineNum}\n`);
        }
        if (
          argv.cfform
          && line.toString()
            .toLowerCase()
            .includes('cfform')
        ) {
          fs.appendFileSync(argv.out, `cfform,${file},${lineNum}\n`);
        }
        if (
          argv.getDate
          && line.toString()
            .toLowerCase()
            .includes('getDate')
        ) {
          fs.appendFileSync(argv.out, `getDate,${file},${lineNum}\n`);
        }
      });
    }
  });
};
module.exports = exe;
