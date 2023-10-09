/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ToggleList
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
function getDate() {
  return new Date().toJSON().slice(0, 10);
}
function getTasksSuffix() {
  return " \u2705 " + getDate();
}
var SUR_DICT = /* @__PURE__ */ new Map([
  ["{tasks-today}", getTasksSuffix]
]);
var REG_DICT = [
  { rule: /\\{tasks-today\\}/, pattern: "\u2705 [0-9]{4}-[0-9]{2}-[0-9]{2}" }
];
var DEFAULT_STATEGROUP = [
  [
    "- ",
    "- [ ] ",
    "- [x] || {tasks-today}",
    ""
  ],
  [
    "- [ ] ",
    "- [ ] #p1 ",
    "- [ ] #p2 ",
    "- [ ] #p3 "
  ],
  [
    "- ? ",
    "- ! ",
    "- ~ "
  ]
];
var DEFAULT_CMD = [
  {
    index: 0,
    name: "Task",
    tmp_name: "Task",
    bindings: [0]
  },
  {
    index: 1,
    name: "Task Priority",
    tmp_name: "Task Priority",
    bindings: [1]
  },
  {
    index: 2,
    name: "Call out",
    tmp_name: "Call out",
    bindings: [2]
  },
  {
    index: 3,
    name: "Task + Callout",
    tmp_name: "Task + Callout",
    bindings: [0, 2]
  }
];
var EMPTY_STATES = Array();
var Setup = class {
  constructor(STATES) {
    this.index = 0;
    this.states = STATES;
    updateSettingStates(this);
  }
};
var ToggleListSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    let settings = this.plugin.settings;
    addSettingUI(this, settings);
    this.containerEl.createEl("h2", { text: "Basic Usage" });
    this.containerEl.createEl("li", { text: 'All states are concatenated with \n in "States"' });
    this.containerEl.createEl("li", { text: 'You can add/delete states directly in "States" Field' });
    this.containerEl.createEl("li", { text: 'Leave the state field blank will make the line a "paragraph" in that state' });
    this.containerEl.createEl("h2", { text: "Use with Suffix (support Tasks Plugin!)" });
    this.containerEl.createEl("li", { text: 'States including "||" will be separated into prefix and suffix' });
    this.containerEl.createEl("li", { text: 'Line{raw} will be decorated in form of "{prefix}{raw}{suffix}"' });
    this.containerEl.createEl("li", { text: '{tasks-today} in suffix will add "\u2705 YYYY-MM-DD".(for Tasks Plugin)' });
    this.containerEl.createEl("h2", { text: "Hotkey" });
    this.containerEl.createEl("li", { text: "You can setup the hotkey for each command." });
    this.containerEl.createEl("h2", { text: "Command Binding to multiple groups" });
    this.containerEl.createEl("li", { text: "You can bind multiple groups to a command, so you can use single hotkey for multiple purposes based on current line context." });
    this.containerEl.createEl("li", { text: "The order in the binding field specifies the order of groups being matched." });
  }
};
function parseSuffix(text) {
  const regex = /(\{.*\})/;
  const ff = text.match(regex);
  const found = ff || [];
  let suffix = text;
  if (found.length > 0) {
    suffix = (SUR_DICT.get(found[1]) || (() => ""))() || suffix;
  }
  return suffix;
}
function ChangeState(text, prev, next) {
  const pre = next[0] || "";
  const sur = parseSuffix(next[1]) || "";
  return pre + text + sur;
}
function getRegExp(text) {
  let t = text || "";
  t = t.replace(/([\.\+\*\?\^\$\(\)\[\]\{\}\|\\])/g, "\\$1");
  for (let i = 0; i < REG_DICT.length; i++)
    t = t.replace(REG_DICT[i].rule, REG_DICT[i].pattern);
  return t;
}
function getCurrentState(text, states) {
  console.log(states);
  for (let i = 0; i < states.length; i++) {
    const s = states[i].split("||");
    const prefix = getRegExp(s[0]);
    const suffix = getRegExp(s[1]);
    let state_regex = new RegExp(`^(\\s*)${prefix}(.*)${suffix}$`);
    const result = text.match(state_regex) || [];
    console.log(state_regex);
    console.log(result);
    if (result.length > 0) {
      console.log(`${prefix}::${result[2]}||${suffix}`);
      return { sorted_idx: i, raw: result[2], idents: result[1] };
    }
  }
  return { sorted_idx: -1, raw: "" };
}
function separatePreSur(state) {
  const strings = state.split("||");
  strings.push("");
  return strings;
}
function roundAdd(a, b, low, high) {
  let result = a + b;
  if (result == high)
    result = low;
  if (result < low)
    result = high - 1;
  return result;
}
function processOneLine(text, setup, direction) {
  const cur_match = getCurrentState(text, setup.sorteds);
  if (cur_match.sorted_idx < 0) {
    return { success: false, content: text, offset: 0 };
  }
  const cur_idx = setup.states_dict.get(cur_match.sorted_idx) || 0;
  const next_idx = roundAdd(cur_idx, direction, 0, setup.states.length);
  const cur_pair = separatePreSur(setup.states[cur_idx]);
  const next_pair = separatePreSur(setup.states[next_idx]);
  const new_text = cur_match.idents + ChangeState(cur_match.raw, cur_pair, next_pair);
  const offset = next_pair[0].length - cur_pair[0].length;
  return { success: true, content: new_text, offset };
}
function toggleAction(editor, view, sg_list, bindings, direction) {
  let selection = editor.listSelections()[0];
  let cursor = editor.getCursor();
  let set_cur = false;
  if (selection.head.ch == selection.anchor.ch && selection.head.line == selection.anchor.line)
    set_cur = true;
  const head = selection.head.line;
  const anchor = selection.anchor.line;
  let start_line = head;
  let end_line = anchor;
  if (start_line > end_line) {
    start_line = anchor;
    end_line = head;
  }
  for (let i = start_line; i <= end_line; i++) {
    const origin = editor.getLine(i);
    let r = { success: false, content: origin, offset: 0 };
    for (let i2 = 0; i2 < bindings.length; i2++) {
      r = processOneLine(origin, sg_list[bindings[i2]], direction);
      if (r.success)
        break;
    }
    editor.setLine(i, r.content);
    if (i == cursor.line) {
      if (cursor.ch < -r.offset)
        cursor.ch = 0;
      else if (cursor.ch + r.offset > r.content.length)
        cursor.ch = r.content.length;
      else
        cursor.ch = cursor.ch + r.offset;
    }
    if (i == head) {
      if (selection.head.ch < -r.offset)
        selection.head.ch = 0;
      else if (selection.head.ch + r.offset > r.content.length)
        selection.head.ch = r.content.length;
      else
        selection.head.ch = selection.head.ch + r.offset;
    }
    if (i == anchor) {
      if (selection.anchor.ch < -r.offset)
        selection.anchor.ch = 0;
      else if (selection.anchor.ch + r.offset > r.content.length)
        selection.anchor.ch = r.content.length;
      else
        selection.anchor.ch = selection.anchor.ch + r.offset;
    }
  }
  editor.setSelection(selection.anchor, selection.head);
  if (set_cur)
    editor.setCursor(cursor);
}
function updateSettingStates(setup) {
  setup.all_states = setup.states.join("\n");
  const ori_states = setup.states;
  const tmp = /* @__PURE__ */ new Map();
  const new_tmp = /* @__PURE__ */ new Map();
  ori_states.forEach((os, idx) => tmp.set(os, idx));
  setup.sorteds = ori_states.slice(0);
  setup.sorteds = setup.sorteds.sort((a, b) => b.length - a.length);
  setup.sorteds.forEach((ss, idx) => new_tmp.set(idx, tmp.get(ss)));
  setup.states_dict = new_tmp;
}
function registerAction(plugin, action, sg_list) {
  const n_name = `${action.name}-Next`;
  const p_name = `${action.name}-Prev`;
  plugin.addCommand({
    id: n_name,
    name: n_name,
    icon: "right-arrow",
    editorCallback: (editor, view) => {
      toggleAction(editor, view, sg_list, action.bindings, 1);
    }
  });
  plugin.addCommand({
    id: p_name,
    name: p_name,
    icon: "left-arrow",
    editorCallback: (editor, view) => {
      toggleAction(editor, view, sg_list, action.bindings, -1);
    }
  });
}
function registerActions(plugin) {
  const sg_list = plugin.settings.setup_list;
  plugin.settings.cmd_list.forEach((cmd) => {
    registerAction(plugin, cmd, sg_list);
  });
}
function unregistAction(plugin, cmd_name) {
  deleteObsidianCommand(this.app, `obsidian-toggle-list:${cmd_name}-Next`);
  deleteObsidianCommand(this.app, `obsidian-toggle-list:${cmd_name}-Prev`);
}
function removeStateGroup(plugin, setup) {
  const index = setup.index;
  let sg = plugin.settings.setup_list.splice(index, 1)[0];
  plugin.saveSettings();
}
function getStateFromText(setup, text_value) {
  setup.all_states = text_value;
  setup.states = text_value.split("\n");
  updateSettingStates(setup);
}
function addSetupUI(container, setup) {
  let sg_ui = new import_obsidian.Setting(container.containerEl).addButton((cb) => {
    cb.setIcon("trash").setCta().onClick(() => {
      removeStateGroup(container.plugin, setup);
      container.display();
    });
  });
  sg_ui.setName("State Group: " + setup.index.toString()).addTextArea((text) => text.setValue(setup.all_states).onChange(async (text_value) => {
    getStateFromText(setup, text_value);
    await container.plugin.saveSettings();
  }));
}
function updateListIndexs(setup_list) {
  setup_list.forEach((setup, idx) => setup.index = idx);
}
function reloadSetting(container, settings) {
  updateListIndexs(settings.setup_list);
  container.plugin.saveSettings();
  registerActions(container.plugin);
  container.display();
}
function resetSetting(plugin) {
  const settings = plugin.settings;
  settings.setup_list = [];
  DEFAULT_STATEGROUP.forEach((e) => {
    settings.setup_list.push(new Setup(e));
  });
  updateListIndexs(settings.setup_list);
  if (settings.cmd_list)
    settings.cmd_list.forEach((cmd) => unregistAction(plugin, cmd.name));
  settings.cmd_list = [];
  DEFAULT_CMD.forEach((e) => {
    settings.cmd_list.push(e);
  });
}
function addSettingUI(container, settings) {
  container.containerEl.createEl("h2", { text: "Setup The States to Toggle" });
  const setup_list = settings.setup_list;
  settings.setup_list.forEach((setup) => {
    addSetupUI(container, setup);
  });
  const aa = new import_obsidian.Setting(container.containerEl).addButton((cb) => {
    cb.setButtonText("+ State Group").setCta().onClick(() => {
      console.log("ToggleList: + State Group");
      settings = container.plugin.settings;
      const idx = Math.floor(Math.random() * DEFAULT_STATEGROUP.length);
      settings.setup_list.push(new Setup(DEFAULT_STATEGROUP[idx]));
      reloadSetting(container, settings);
    });
  });
  const cmd_list = settings.cmd_list;
  container.containerEl.createEl("h2", { text: "Bind the Commands with State Groups" });
  container.containerEl.createEl("p", { text: "Order of bindings matters if two SG share the same states" });
  for (let i = 0; i < cmd_list.length; i++) {
    const cmd_section = new import_obsidian.Setting(container.containerEl).setName(`${cmd_list[i].name}`).setDesc(`[Command Name] [Binding State Groups]`).addButton((cb) => {
      cb.setIcon("trash");
      cb.setCta();
      cb.onClick(() => {
        unregistAction(container.plugin, cmd_list[i].name);
        cmd_list.splice(i, 1);
        reloadSetting(container, settings);
      });
    }).addText((cb) => {
      cb.setValue(cmd_list[i].name);
      cb.setPlaceholder("Command Name");
      cb.onChange((value) => {
        cmd_list[i].tmp_name = value;
      });
    }).addText((cb) => {
      cb.setValue(cmd_list[i].bindings.map((x) => x.toString()).join(", "));
      cb.setPlaceholder("Indes of State Groups: 0, 1, 2");
      cb.onChange((value) => {
        cmd_list[i].bindings = value.split(",").map((x) => parseInt(x, 10));
        container.plugin.saveSettings();
      });
    }).addButton((cb) => {
      cb.setIcon("checkmark");
      cb.setCta();
      cb.onClick(() => {
        unregistAction(container.plugin, cmd_list[i].name);
        cmd_list[i].name = cmd_list[i].tmp_name;
        cmd_list[i].bindings = cmd_list[i].bindings.filter((b) => b < setup_list.length);
        cmd_list[i].bindings = [...new Set(cmd_list[i].bindings)];
        reloadSetting(container, settings);
      });
    });
  }
  new import_obsidian.Setting(container.containerEl).addButton((cb) => {
    cb.setButtonText("+ Command");
    cb.setCta();
    cb.onClick(() => {
      const name = `Command ${settings.cmd_list.length}`;
      settings.cmd_list.push({ index: settings.cmd_list.length, name, tmp_name: name, bindings: [0] });
      reloadSetting(container, settings);
    });
  });
  const other = new import_obsidian.Setting(container.containerEl);
  other.addButton((cb) => {
    cb.setButtonText("\u{1F525} Hotkeys").setCta().onClick(() => {
      console.log("ToggleList: go to hotkey panel");
      this.app.setting.openTabById("hotkeys").setQuery("ToggleList");
    });
  });
  other.addButton((cb) => {
    cb.setButtonText("\u21BB Reset").setCta().onClick(async () => {
      console.log("ToggleList: Reset");
      const stamp = new Date().toISOString();
      await this.app.vault.writeConfigJson(`plugins/obsidian-toggle-list/backup-${stamp}`, settings);
      new import_obsidian.Notice(`ToggleList: Original config is saved in plugins/obsidian-toggle-list/backup-${stamp}.json`);
      resetSetting(container.plugin);
      reloadSetting(container, settings);
    });
  });
}
function deleteObsidianCommand(app, commandId) {
  if (app.commands.findCommand(commandId)) {
    delete app.commands.commands[commandId];
    delete app.commands.editorCommands[commandId];
  }
}
var ToggleList = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ToggleListSettingTab(this.app, this));
    registerActions(this);
  }
  async loadSettings() {
    console.log("ToggleList: Loading settings:");
    this.settings = Object.assign({}, await this.loadData());
    if (!this.settings.setup_list) {
      console.log("ToggleList: Create default setups");
      resetSetting(this);
      this.saveSettings();
    } else {
      this.settings.setup_list.forEach((setup) => updateSettingStates(setup));
    }
    if (!this.settings.cmd_list) {
      this.settings.cmd_list = Array();
      this.settings.cmd_list.push({ index: 0, bindings: [0], name: "command-0", tmp_name: "" });
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};