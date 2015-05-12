# goslund/gardenpath

gardenpath is a simple user authentication system designed to serve a userbase to various web services.

##Installation:

###First clone the repository:

```bash 
mkdir gardenpath-deploy
cd gardenpath-deploy
git clone git@github.com:goslund/gardenpath.git .
```
###Then, use npm to install all the dependencies:

```
npm install
```

####Then install dependencies:
```
npm install -d
```




##Configuration:

####First, edit the example:

```
cp ./config/config.js.example ./config/config.js
```

####Edit the new file to meet your needs:
`
nano ./config/config.js
`

###Configuration Options

Each object in the Config file is an environment in the application:
```javascript
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = {
  //object name here is the environment name for the environment variable.
  development: {
    root: rootPath,
    app: {
      name: 'gardenpath-app'
    },
    /*
    gardenpath server options
    */
    port: 3080,
    host: 'myhost.com',

    /*
    use the sync sequelize method --safe for 
    staging and production without the forceSync Option
    */
    sync: true,

    //use the force option with sync (not production safe, resets fixture data)
    forceSync: true,

    //set your sequelize database string here
    db: 'mysql://username:password@localhost/database'
    }
  };

module.exports = config[env];
```

###Set Env Variable
You will have to setup your environment variable to run the application in the named environment above..
####Bash: 
Add the environment variable to your `~/.bashrc` file:

```bash
export NODE_ENV=development
```



