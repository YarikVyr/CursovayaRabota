import { localStorageAdapter, storageKeys } from '@/shared/lib/storage/localStorageAdapter';

export const EditorService = {
  STORAGE_KEYS: {
    PROJECTS: storageKeys.projects,
    atmsByProject: storageKeys.atmsByProject
  },

  // МЕТОДЫ РАБОТЫ С LOCALSTORAGE 

  // Получение из localstorage полного списка АТМ для выбранного тренажера
  getAtms(projectId) {
    const atms = localStorageAdapter.getJson(this.STORAGE_KEYS.atmsByProject(projectId), []);
    return Array.isArray(atms) ? atms : [];
  },

  getProject(projectId) {
    const projects = localStorageAdapter.getJson(this.STORAGE_KEYS.PROJECTS, []);
    return Array.isArray(projects)
      ? projects.find(project => String(project.id) === String(projectId))
      : null;
  },

  getAtm(projectId, atmId) {
    return this.getAtms(projectId).find(atm => String(atm.id) === String(atmId)) || null;
  },

  // Перезапись списка АТМ для конкретного проекта в localstorage
  saveAtms(projectId, atms) {
    localStorageAdapter.setJson(this.STORAGE_KEYS.atmsByProject(projectId), atms);
  },

  updateAtmAndProject(projectId, atmId, newData) {
    const atms = this.getAtms(projectId);
    const updatedAtms = atms.map(item => 
      String(item.id) === String(atmId) 
        ? { ...item, ...newData, updatedAt: Date.now() } 
        : item
    );
    this.saveAtms(projectId, updatedAtms);

    // Поиск проекта в списке проектов и изменение его даты
    const projects = localStorageAdapter.getJson(this.STORAGE_KEYS.PROJECTS, []);
    if (projects.length) {
      const updatedProjects = projects.map(p => 
        String(p.id) === String(projectId) ? { ...p, updatedAt: Date.now() } : p
      );
      localStorageAdapter.setJson(this.STORAGE_KEYS.PROJECTS, updatedProjects);
    }
  },

  // Инициализация структуры таблиц АТМ при самом первом входе в конструктор
  getInitialRows(existingAtmData, initialText = this.getRevisionDescription(1)) {
    const defaultRevisions = [{id: Date.now(),rev: "1",date: new Date().toLocaleDateString('ru-RU'),desc: initialText, reason: "", snapshot: null}];

    const defaultEquipment = [{id: Date.now() + Math.random(),name: '',model: '',calDate: ''}];

    const defaultSources = [{id: crypto.randomUUID?.() || Date.now() + Math.random(),docNumber: '',rev: '',docName: ''}];

    const defaultTolerances = [{id: crypto.randomUUID?.() || Date.now() + Math.random(),param: '',tolerance: '',nominal: '',unit: ''}];

    const defaultAbbreviations = [{id: crypto.randomUUID?.() || Date.now() + Math.random(), abbr: '', desc: ''}];

    // Сборка скелета АТМ. Если документ открыт впервые и в базе ничего нет - создаются пустые массивы под таблицы
    return {
      abbreviations: (existingAtmData?.abbreviations && existingAtmData.abbreviations.length > 0) ? existingAtmData.abbreviations : defaultAbbreviations, 
      discrepancies: existingAtmData?.discrepancies || [], 
      approvals: existingAtmData?.approvals || [],       
      equipment: (existingAtmData?.equipment && existingAtmData.equipment.length > 0)? existingAtmData.equipment : defaultEquipment,       
      tolerances: (existingAtmData?.tolerances && existingAtmData.tolerances.length > 0) ? existingAtmData.tolerances : defaultTolerances,      
      sources: (existingAtmData?.sources && existingAtmData.sources.length > 0) ? existingAtmData.sources : defaultSources,          
      revisions: (existingAtmData?.revisions && existingAtmData.revisions.length > 0) 
        ? existingAtmData.revisions 
        : defaultRevisions
    };
  },

  // ЛОГИКА ДЛЯ ВКЛАДКИ ТИТУЛЬНОГО ЛИСТА

  // Загрузка файла логотипа
  async handleFileUpload(file, type, projectId, atmId, atmData, updateAtmData) {
    if (!file) return;
    try {
      const base64 = await this.fileToBase64(file); 
      const fieldName = type === 'customer' ? 'customerLogo' : 'executorLogo';
      const newData = { [fieldName]: base64 };
      
      updateAtmData(newData); 
    } catch (err) {
      console.error('Logo upload failed', err);
    }
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); 
      reader.onerror = (error) => reject(error); 
    });
  },

  getRevisionDescription(revisionNumber) {
    const descriptions = {
      1: 'Первоначальная версия документа',
      2: 'Вторая версия документа',
      3: 'Третья версия документа',
      4: 'Четвертая версия документа',
      5: 'Пятая версия документа',
      6: 'Шестая версия документа',
      7: 'Седьмая версия документа',
      8: 'Восьмая версия документа',
      9: 'Девятая версия документа',
      10: 'Десятая версия документа',
      11: 'Одиннадцатая версия документа',
      12: 'Двенадцатая версия документа',
      13: 'Тринадцатая версия документа',
      14: 'Четырнадцатая версия документа',
      15: 'Пятнадцатая версия документа',
      16: 'Шестнадцатая версия документа',
      17: 'Семнадцатая версия документа',
      18: 'Восемнадцатая версия документа',
      19: 'Девятнадцатая версия документа',
      20: 'Двадцатая версия документа'
    };

    return descriptions[revisionNumber] || `${revisionNumber}-я версия документа`;
  },

  // ЛОГИКА ДЛЯ ВКЛАДКИ ЛИСТ СОГЛАСОВАНИЯ

  // Добавление пустой строки организации
  buildRevisionSnapshot(allRows, currentAtmData) {
    const safeRows = allRows || {};

    return JSON.parse(JSON.stringify({
      abbreviations: safeRows.abbreviations || [],
      discrepancies: safeRows.discrepancies || [],
      approvals: safeRows.approvals || [],
      equipment: safeRows.equipment || [],
      tolerances: safeRows.tolerances || [],
      sources: safeRows.sources || [],
      contractName: currentAtmData?.contractName || '',
      docNumber: currentAtmData?.docNumber || '',
      customerLogo: currentAtmData?.customerLogo || null,
      executorLogo: currentAtmData?.executorLogo || null,
    }));
  },

  addCompany(rows) {
    return [...rows, { id: Date.now(), name: '', representatives: [] }];
  }, 

  // Удаление организации
  removeCompany(rows, id) {
    return rows.filter(row => row.id !== id);
  },

  // Обновление названия организации
  updateCompanyName(rows, id, name) {
    return rows.map(row => row.id === id ? { ...row, name } : row);
  },

  // Добавление пустой строки представителя внутрь организации
  addRepresentative(rows, companyId) {
    return rows.map(row => {
      if (row.id === companyId) {
        return {
          ...row,
          representatives: [...row.representatives, { id: Date.now(), role: '', fullName: '' }]
        };
      }
      return row;
    });
  },

  // Удаление представителя из организации
  removeRepresentative(rows, companyId, repId) {
    return rows.map(row => {
      if (row.id === companyId) {
        return {
          ...row,
          representatives: row.representatives.filter(rep => rep.id !== repId)
        };
      }
      return row;
    });
  },

  // Обновление поля Должность или ФИО у представителя
  updateRepField(rows, companyId, repId, field, value) {
    return rows.map(row => {
      if (row.id === companyId) {
        return {
          ...row,
          representatives: row.representatives.map(rep => 
            rep.id === repId ? { ...rep, [field]: value } : rep
          )
        };
      }
      return row;
    });
  },

  // ЛОГИКА ДЛЯ ВКЛАДКИ РЕГИСТРАЦИЯ ИЗМЕНЕНИЙ

  // Выпуск новой ревизии АТМ и намертво блокировка намертво старых данных
  addRevision(allRows, currentAtmData) { 
    const safeRows = allRows || { revisions: [] };
    const revisions = safeRows.revisions || [];
    
    // Блокировка абсолютно всех предыдущие ревизии и их архивация
    const lastRev = revisions[revisions.length - 1];
    const nextRevNum = lastRev ? Number(lastRev.rev) + 1 : 1;

    // Создание слепка
    const dataSnapshot = this.buildRevisionSnapshot(safeRows, currentAtmData);

    const lockedRevisions = revisions.map((rev, index) => ({
      ...rev,
      isLocked: true,
      snapshot: index === revisions.length - 1 ? dataSnapshot : rev.snapshot
    }));

    // Формирование объекта новой ревизии с возможностью редактирования
    const newRev = {
      id: Date.now(),
      rev: String(nextRevNum),
      date: new Date().toLocaleDateString('ru-RU'),
      desc: this.getRevisionDescription(nextRevNum), 
      reason: '',
      isLocked: false, 
      snapshot: null
    };

    return [...lockedRevisions, newRev];
  },

  // Отмена последней ревизии АТМ и возвращение сохраненного слепка для отката таблиц конструктора
  removeLastRevision(allRows) {
    const revs = allRows?.revisions || [];
    if (revs.length <= 1) return null;

    const previousRev = revs[revs.length - 2];
    const snapshot = previousRev?.snapshot || revs[revs.length - 1]?.snapshot || null; 
    const updatedRevisions = revs.slice(0, -1).map((rev, index, list) => ({
      ...rev,
      isLocked: index !== list.length - 1
    }));

    return {
      updatedRevisions,
      snapshot
    };
  },

  // Обновление полей в таблице регистрации изменений
  restoreRowsFromSnapshot(snapshot, revisions) {
    return {
      abbreviations: snapshot?.abbreviations || [],
      discrepancies: snapshot?.discrepancies || [],
      approvals: snapshot?.approvals || [],
      equipment: snapshot?.equipment || [],
      tolerances: snapshot?.tolerances || [],
      sources: snapshot?.sources || [],
      revisions: revisions || []
    };
  },

  restoreAtmDataFromSnapshot(currentAtmData, snapshot) {
    return {
      ...currentAtmData,
      contractName: snapshot?.contractName || '',
      docNumber: snapshot?.docNumber || '',
      customerLogo: snapshot?.customerLogo || null,
      executorLogo: snapshot?.executorLogo || null
    };
  },

  getRevisionSnapshot(rows, viewingRevIndex) {
    const revisions = rows?.revisions || [];
    if (viewingRevIndex === null || viewingRevIndex === revisions.length - 1) return null;

    return revisions[viewingRevIndex]?.snapshot || null;
  },

  getDisplayRows(rows, viewingRevIndex) {
    const snapshot = this.getRevisionSnapshot(rows, viewingRevIndex);
    if (!snapshot) return rows;

    return {
      ...snapshot,
      revisions: rows?.revisions || []
    };
  },

  getDisplayAtmData(atmData, rows, viewingRevIndex) {
    const snapshot = this.getRevisionSnapshot(rows, viewingRevIndex);
    return snapshot
      ? this.restoreAtmDataFromSnapshot(atmData, snapshot)
      : atmData;
  },

  getCurrentRevisionNumber(rows) {
    const revisions = rows?.revisions || [];
    return revisions.length > 0 ? revisions[revisions.length - 1].rev : '1';
  },

  isEditorReadOnly(rows, viewingRevIndex) {
    const revisions = rows?.revisions || [];

    if (viewingRevIndex !== null && viewingRevIndex !== revisions.length - 1) {
      return true;
    }

    return Boolean(revisions[revisions.length - 1]?.isLocked);
  },

  updateRevisionField(allRows, index, field, value) {
    const revs = allRows?.revisions || [];
    const targetRev = revs[index];
    
    // Защита: если ревизия уже заблокирована - запрет на изменение её описания
    if (targetRev?.isLocked) return revs;

    return revs.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
  },

  // Проверка, заполнены ли обязательные поля
  validateLastRevision(revisionsArray) {
    if (!revisionsArray || revisionsArray.length === 0) return {};
    
    const lastRev = revisionsArray[revisionsArray.length - 1];
    const errors = {};

    if (!lastRev?.desc || !String(lastRev.desc).trim()) errors.desc = true;

    if (revisionsArray.length > 1) {
      if (!lastRev?.reason || !String(lastRev.reason).trim()) {
        errors.reason = true;
      }
    }
    
    if (!lastRev?.date || !String(lastRev.date).trim()) errors.date = true;

    return errors;
  },

    // ЛОГИКА ДЛЯ ВКЛАДКИ ЛАБОРАТОРНОЕ ОБОРУДОВАНИЕ
  
  // Добавление новой пустой строки лабораторного оборудования
  addEquipmentRow(currentEquipment = []) {
    return [
      ...currentEquipment,
      {
        id: crypto.randomUUID?.() || Date.now() + Math.random(),
        name: '',
        model: '',
        calDate: ''
      }
    ];
  },

  // ЛОГИКА ДЛЯ ВКЛАДКИ СПИСОК ДОКУМЕНТАЦИИ
  addSourceRow(currentSources = []) {
    return [
      ...currentSources,
      {
        id: crypto.randomUUID?.() || Date.now() + Math.random(),
        docNumber: '',
        rev: '',
        docName: ''
      }
    ];
  },

  // ЛОГИКА ДЛЯ ВКЛАДКИ ДОПУСКИ
  addToleranceRow(currentTolerances = []) {
    return [
      ...currentTolerances, 
      {
        id: crypto.randomUUID?.() || Date.now() + Math.random(),
        param: '',
        tolerance: '',
        nominal: '',
        unit: ''
      }
    ];
  }, 

  // ЛОГИКА ДЛЯ ВКЛАДКИ СОКРАЩЕНИЙ
  addAbbreviationRow(currentAbbreviations = []) {
    return [
      ...currentAbbreviations,
      {
        id: crypto.randomUUID?.() || Date.now() + Math.random(),
        abbr: '', 
        desc: ''
      }
    ];
  },

  // Метод комплексного сохранения всех таблиц текущего АТМ в localStorage
  saveFullEditorData(projectId, atmId, allRows) {
    const atms = this.getAtms(projectId);
    const currentAtm = atms.find(a => String(a.id) === String(atmId));
    
    // Склейка метаданных документа АТМ со всеми массивами таблиц из конструктора
    const updatedData = {
      ...currentAtm,
      ...allRows, 
      updatedAt: Date.now()
    };

    this.updateAtmAndProject(projectId, atmId, updatedData);
  },
};
