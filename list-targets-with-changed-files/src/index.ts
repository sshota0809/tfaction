import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

const yaml = require('js-yaml');

function getInput(name: string, envName: string): string {
  const value = core.getInput(name);
  if (value != '') {
    return value;
  }
  const valueEnv = process.env[envName];
  if (valueEnv === undefined || valueEnv == '') {
    return '';
  }
  return valueEnv;
}

try {
  const configFilePath = getInput('config', 'TFACTION_CONFIG');
  if (configFilePath == '') {
    throw 'the input "config" or environment variable TFACTION_CONFIG is required';
  }
  const config = yaml.load(fs.readFileSync(configFilePath, 'utf8'));

  const configWorkingDirMap = new Map();
  const configTargetMap = new Map();
  for (let i = 0; i < config.targets.length; i++) {
    const target = config.targets[i];
    configWorkingDirMap.set(target.working_directory, target);
    configTargetMap.set(target.target, target);
  }

  const labels = fs.readFileSync(core.getInput('labels'), 'utf8').split('\n');
  const changedFiles = fs.readFileSync(core.getInput('changed_files'), 'utf8').split('\n');
  const configFiles = fs.readFileSync(core.getInput('config_files'), 'utf8').split('\n');
  const workingDirs = new Set<string>();
  for (let i = 0; i < configFiles.length; i++) {
    const configFile = configFiles[i];
    if (configFile == '') {
      continue;
    }
    workingDirs.add(path.dirname(configFile));
  }

  const terraformTargets = new Set<string>();
  const tfmigrates = new Set<string>();
  const ignores = new Set<string>();
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (label == '') {
      continue;
    }
    if (label.startsWith(config.label_prefixes.target)) {
      const target = label.slice(config.label_prefixes.target.length);
      terraformTargets.add(target);
      continue;
    }
    if (label.startsWith(config.label_prefixes.tfmigrate)) {
      const target = label.slice(config.label_prefixes.tfmigrate.length);
      tfmigrates.add(target);
      continue;
    }
    if (label.startsWith(config.label_prefixes.ignore)) {
      ignores.add(label.slice(config.label_prefixes.ignore.length));
      continue;
    }
  }

  const changedWorkingDirs = new Set<string>();
  for (let i = 0; i < changedFiles.length; i++) {
    const changedFile = changedFiles[i];
    if (changedFile == '') {
      continue;
    }
    for (let workingDir of workingDirs) {
      if (changedFile.startsWith(workingDir + '/')) {
        changedWorkingDirs.add(workingDir);
      }
    }
  }

  for (let changedWorkingDir of changedWorkingDirs) {
    for (let i = 0; i < config.targets.length; i++) {
      const target = config.targets[i];
      if (changedWorkingDir.startsWith(target.working_directory)) {
        const changedTarget = changedWorkingDir.replace(target.working_directory, target.target);
        if (!terraformTargets.has(changedTarget) && !ignores.has(changedTarget) && !tfmigrates.has(changedTarget)) {
          terraformTargets.add(changedTarget);
        }
        break;
      }
    }
  }
  core.setOutput('tfmigrate_targets', Array.from(tfmigrates));
  core.setOutput('terraform_targets', Array.from(terraformTargets));
} catch (error) {
  core.setFailed(error instanceof Error ? error.message : JSON.stringify(error));
}
