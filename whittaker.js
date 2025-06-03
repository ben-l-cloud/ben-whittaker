"use strict";

// Whittaker Tech 255 ///
// process.env.remote.b.whittaker.js

// else

// > error.no.active.js.running

// © Whuttaker Tech 255 ..... I'M UNSTOPPABLE NOW..

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const pluginsDir = path.join(__dirname, "plugins");

// Object itakayoshikilia plugins zote
const plugins = {};

// Function ya load plugins
function loadPlugins() {
  if (!fs.existsSync(pluginsDir)) {
    console.log(chalk.yellow("Plugins folder haipo. Creating..."));
    fs.mkdirSync(pluginsDir);
  }

  const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith(".js"));
  
  for (const file of files) {
    try {
      const pluginPath = path.join(pluginsDir, file);
      // Clear cache ili iweze reload fresh kila run
      delete require.cache[require.resolve(pluginPath)];
      
      const plugin = require(pluginPath);
      const pluginName = path.basename(file, ".js");
      plugins[pluginName] = plugin;
      console.log(chalk.green(`Plugin loaded: ${pluginName}`));
    } catch (err) {
      console.log(chalk.red(`Error loading plugin ${file}: ${err.message}`));
    }
  }
}

// Example: run plugins if they export a function named run()
function runPlugins() {
  for (const [name, plugin] of Object.entries(plugins)) {
    if (typeof plugin.run === "function") {
      try {
        plugin.run();
        console.log(chalk.blue(`Ran plugin: ${name}`));
      } catch (err) {
        console.log(chalk.red(`Error running plugin ${name}: ${err.message}`));
      }
    }
  }
}

// Load plugins on start
loadPlugins();

// Example call
runPlugins();

// Export plugins object kwa matumizi mengine (ikiwa unataka)
module.exports = { plugins };
