import { observable, action } from 'mobx';

import BasicStore from './BasicStore';

import languages from '../translations/languages';

import {
  EVENT_LEVEL_PACK_CHANGE,
  EVENT_LEVEL_CHANGE,
  EVENT_LEVEL_RESET,
  EVENT_MOVE_START,
  EVENT_MOVE_END
} from '../constants/event';

import { levelPacks } from '../constants/level';

class GameStore extends BasicStore {
  game;

  @observable languageId = languages[0].id;
  @observable levelPackFileName = levelPacks[0].fileName;

  @observable levelNumber = 0;
  @observable movesCount = 0;
  @observable pushesCount = 0;
  @observable boxesCount = 0;
  @observable retractedBoxesCount = 0;

  constructor(options = {}) {
    super({
      ...options,
      key: 'game',
      include: ['languageId', 'levelPackFileName']
    });
  }

  init(options = {}) {
    const { eventBus } = options;
    if (!eventBus) {
      throw new TypeError('Event bus is not specified.');
    }
    this.eventBus = eventBus;

    this.onLevelPackChange = this.onLevelPackChange.bind(this);
    this.onLevelChange = this.onLevelChange.bind(this);
    this.onLevelReset = this.onLevelReset.bind(this);
    this.onMoveStart = this.onMoveStart.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);

    this.eventBus.on(EVENT_LEVEL_PACK_CHANGE, this.onLevelPackChange);
    this.eventBus.on(EVENT_LEVEL_CHANGE, this.onLevelChange);
    this.eventBus.on(EVENT_LEVEL_RESET, this.onLevelReset);
    this.eventBus.on(EVENT_MOVE_START, this.onMoveStart);
    this.eventBus.on(EVENT_MOVE_END, this.onMoveEnd);
  }

  destroy() {
    this.eventBus.off(EVENT_LEVEL_CHANGE, this.onLevelChange);
    return super.destroy();
  }

  @action setLanguageId(id) {
    const language = languages.find(language => language.id === id);
    if (language) {
      this.languageId = id;
    }
  }

  @action setLevelPackFileName(fileName) {
    if (fileName === this.levelPackFileName) {
      return;
    }
    const levelPack = levelPacks.find(levelPack => levelPack.fileName === fileName);
    if (!levelPack) {
      return;
    }
    this.levelPackFileName = fileName;
    if (this.game && (!this.game.levelPack || this.game.levelPack.fileName !== fileName)) {
      this.game.loadLevelPack(`levels/${fileName}`).catch(e => console.error(e));
    }
  }

  updateLevelProperties(properties = {}) {
    const {
      levelNumber,
      movesCount,
      pushesCount,
      boxesCount,
      retractedBoxesCount
    } = properties;

    if (typeof levelNumber === 'number') {
      this.levelNumber = levelNumber;
    }

    if (typeof movesCount === 'number') {
      this.movesCount = movesCount;
    }

    if (typeof pushesCount === 'number') {
      this.pushesCount = pushesCount;
    }

    if (typeof boxesCount === 'number') {
      this.boxesCount = boxesCount;
    }

    if (typeof retractedBoxesCount === 'number') {
      this.retractedBoxesCount = retractedBoxesCount;
    }
  }

  onLevelPackChange(source) {
    let fileName;
    if (source instanceof File) {
      fileName = source.name;
    }
    else {
      fileName = source;
    }
    fileName = fileName.split('/').pop();
    this.setLevelPackFileName(fileName);
  }

  onLevelChange(params) {
    this.updateLevelProperties(params);
  }

  onLevelReset(params) {
    this.updateLevelProperties(params);
  }

  onMoveStart(params) {
    this.updateLevelProperties(params);
  }

  onMoveEnd(params) {
    this.updateLevelProperties(params);
  }
}

export default GameStore;
