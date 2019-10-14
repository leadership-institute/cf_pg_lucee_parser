## You probably don't need this script, unless you are doing a highly specific migration from Adobe ColdFusion to Lucee with Postgres.

This tool will recursively scan a directory for several strings specified as arguments. 

Installation
```
npm i -g cfvalidator
```

Arguments
```
Options:
  --version              Show version number                   [boolean]
  --out, -o              The output csv filename. Required      [string]
  --in, -i               The directory to scan. Required        [string]
  --scopeIdentity, --si  Detect scope_identity                 [boolean]
  --selectTop, --st      Detect select top                     [boolean]
  --cfform, --cff        Detect cfform                         [boolean]
  --getDate, --gd        Detect getDate                        [boolean]
  --help, -h             Show help                             [boolean]
```

Example
```
cfvalidator --o ~/.out.csv --si --st --cff --gd --i ~/Workspaces/cf_home
```