const chokidar = require('chokidar');
const fs = require('fs');

const monitorMaps = new Map();
const rulesMap = new Map();

const createFileMonitor = (filePath) => {
  const watcher = chokidar.watch(filePath, {
    persistent: true,
  });

  const onFileChanged = () => {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return;
    }
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    rulesMap.set(filePath, content);
  };
  const onFileRemoved = () => {
    watcher.close();
    monitorMaps.delete(filePath);
    rulesMap.delete(filePath);
  };

  // init value
  onFileChanged();
  
  watcher.on('add', onFileChanged);
  watcher.on('change', onFileChanged);
  watcher.on('unlink', onFileRemoved);
};

module.exports = (server) => {
  server.on('request', (req, res) => {
    const localRulePath = req.originalReq.ruleValue;
    if (!monitorMaps.has(localRulePath)) {
      createFileMonitor(localRulePath);
    }
    const rules = Array.from(rulesMap.values()).join('\n');
    res.end(rules);
  });
};
