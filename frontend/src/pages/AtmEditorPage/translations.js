export const translations = {
  RU: {
    back: 'Назад',
    atmStatus: 'Статус ATM:',
    save: 'Сохранить',
    export: 'Экспорт в Word',
    autoSaveLabel: 'Автосохранение:',

    exportModal: {
      title: 'Экспорт в Word',
      description: 'Выберите язык документа',
      buttons: {
        ru: 'Русский',
        en: 'English'
      }
    },

    statuses: {
      draft: 'Черновик',
      process: 'В работе',
      review: 'На проверке',
      ready: 'Готово'
    },

    tabs: {
      title: 'Титульный лист',
      approval: 'Лист согласований',
      registration: 'Регистрация изменений',
      labEquipment: 'Лабораторное оборудование',
      documentation: 'Список документации',
      tolerances: 'Допуски',
      abbreviations: 'Аббревиатуры',
      main: 'Основная часть',
      discrepancies: 'Лист несоответствий'
    },

    lib: 'Библиотека',
    props: 'Редактируемые элементы',
    search: 'Поиск...',
    emptyLib: 'Библиотека пуста',
    selectEl: 'Выберите элемент',
    noElements: 'Нет элементов',

    addFromDb: 'Добавить из БД',
    addManual: 'Добавить вручную',
    fromTestResults: 'Из результатов тестов',
    addSource: 'Добавить документ',
    sourceType: 'Тип документа',
    sourceName: 'Название документа',
    cancel: 'Отмена',
    add: 'Добавить',

    frontPage: {
      title: 'Редактор титульного листа',
      sections: {
        general: 'Общие сведения',
        document: 'Документ',
        organization: 'Организация'
      },
      fields: {
        systemName: 'Название системы:',
        trainerType: 'Тип тренажера:',
        rmiType: 'Тип РМИ:',
        subsystemName: 'Название подсистемы:',
        aircraftType: 'Тип ВС:',
        ata: 'ATA:',
        contractName: 'Название контракта:',
        docNumber: 'Номер документа:',
        revision: 'Ревизия:',
        customerLogo: 'Лого заказчика (правое):',
        executorLogo: 'Лого исполнителя (левое):',
        logoText: 'Лого'
      },
      buttons: {
        upload: 'Загрузить',
        preview: 'Предпросмотр титульного листа'
      },
      placeholders: {
        systemName: 'Название системы',
        trainerType: 'Тип тренажера',
        rmiType: 'Тип РМИ',
        subsystemName: 'Название подсистемы',
        aircraftType: 'Тип ВС',
        ata: 'Код ATA',
        contractName: 'Название контракта',
        docNumber: 'Номер документа'
      }
    },

    approvalPage: {
      title: 'Редактор листа согласований',
      emptyList: 'Список пуст',
      companyNameLabel: 'Название компании:',
      companyNamePlaceholder: 'Название компании',
      roleLabel: 'Должность:',
      rolePlaceholder: 'Должность',
      nameLabel: 'ФИО:',
      namePlaceholder: 'А. А. Петров',
      buttons: {
        addCompany: 'Добавить компанию',
        addRepresentatives: 'Добавить представителей',
        preview: 'Предпросмотр листа согласований'
      }
    },

    revisionPage: {
      title: 'Регистрация изменений',
      revLabel: 'Рев.',
      descriptionLabel: 'Описание изменений',
      reasonLabel: 'Причина',
      dateLabel: 'Дата',
      reasonPlaceholder: 'Введите причину',
      initialRevDesc: 'Первоначальная версия документа',
      buttons: {
        add: 'Добавить ревизию',
        remove: 'Убрать последнюю ревизию',
        preview: 'Предпросмотр регистрации изменений'
      }
    },

    equipmentPage: {
      title: "Лабораторное оборудование",
      nameLabel: "Наименование",
      modelLabel: "Модель",
      dateLabel: "Калибровка до",
      namePlaceholder: "Введите наименование",
      modelPlaceholder: "Введите модель",
      buttons: {
        add: "Добавить оборудование",
        preview: "Предпросмотр листа оборудования"
      }
    },

    documentsPage: {
      title: "Список документации",
      numberLabel: "Номер документа",
      revLabel: "Rev.",
      nameLabel: "Название документа",
      numberPlaceholder: "Введите номер документа",
      revPlaceholder: "Введите rev.",
      namePlaceholder: "Введите название документа",
      buttons: {
        add: "Добавить документ",
        preview: "Предпросмотр списка документации"
      }
    },

    tolerancesPage: {
      title: "Допуски",
      paramLabel: "Параметр",
      toleranceLabel: "Допуск",
      nominalLabel: "Номинал",
      unitLabel: "Ед. изм.",
      paramPlaceholder: "Введите параметр",
      tolerancePlaceholder: "Выберите допуск",
      nominalPlaceholder: "Введите номинал",
      unitPlaceholder: "Выберите ед. изм.",
      buttons: {
        add: "Добавить допуск",
        preview: "Предпросмотр списка допусков"
      }
    },

    abbreviationsPage: {
      title: "Аббревиатуры",
      abbrLabel: "Сокращение",
      descLabel: "Расшифровка",
      abbrPlaceholder: "Выберите сокращение",
      descPlaceholder: "Расшифровка",
      buttons: {
        add: "Добавить аббревиатуру",
        preview: "Предпросмотр списка сокращений"
      }
    },

    discrepanciesPage: {
      title: "Лист несоответствий",
      buttons: {
        goToConstructor: "Перейти в АТР-конструктор"
      }
    }
  },

  EN: {
    back: 'Back',
    atmStatus: 'ATM Status:',
    save: 'Save',
    export: 'Export to Word',
    autoSaveLabel: 'Auto-save:',

    exportModal: {
      title: 'Export to Word',
      description: 'Choose the document language',
      buttons: {
        ru: 'Русский',
        en: 'English'
      }
    },

    statuses: {
      draft: 'Draft',
      process: 'In progress',
      review: 'In review',
      ready: 'Ready'
    },

    tabs: {
      title: 'Title Page',
      approval: 'Approval Sheet',
      registration: 'Change Log',
      labEquipment: 'Laboratory Equipment',
      documentation: 'Documentation List',
      tolerances: 'Tolerances',
      abbreviations: 'Abbreviations',
      main: 'Main Content',
      discrepancies: 'Discrepancy Sheet'
    },

    lib: 'Library',
    props: 'Editable Elements',
    search: 'Search...',
    emptyLib: 'Library is empty',
    selectEl: 'Select an element',
    noElements: 'No elements',

    addFromDb: 'Add from DB',
    addManual: 'Add manually',
    fromTestResults: 'From test results',
    addSource: 'Add document',
    sourceType: 'Document type',
    sourceName: 'Document name',
    cancel: 'Cancel',
    add: 'Add',

    frontPage: {
      title: 'Title Page Editor',
      sections: {
        general: 'General Information',
        document: 'Document',
        organization: 'Organization'
      },
      fields: {
        systemName: 'System name:',
        trainerType: 'Trainer type:',
        rmiType: 'RMI type:',
        subsystemName: 'Subsystem name:',
        aircraftType: 'A/C type:',
        ata: 'ATA:',
        contractName: 'Contract name:',
        docNumber: 'Document number:',
        revision: 'Revision:',
        customerLogo: 'Customer logo (right):',
        executorLogo: 'Contractor logo (left):',
        logoText: 'Logo'
      },
      buttons: {
        upload: 'Upload',
        preview: 'Preview title page'
      },
      placeholders: {
        systemName: 'System name',
        trainerType: 'Trainer type',
        rmiType: 'RMI type',
        subsystemName: 'Subsystem name',
        aircraftType: 'A/C type',
        ata: 'ATA code',
        contractName: 'Contract name',
        docNumber: 'Document number'
      }
    },

    approvalPage: {
      title: 'Approval Sheet Editor',
      emptyList: 'The list is empty',
      companyNameLabel: 'Company name:',
      companyNamePlaceholder: 'Company name',
      roleLabel: 'Position:',
      rolePlaceholder: 'Position',
      nameLabel: 'Full name:',
      namePlaceholder: 'A. A. Petrov',
      buttons: {
        addCompany: 'Add company',
        addRepresentatives: 'Add representatives',
        preview: 'Preview approval sheet'
      }
    },

    revisionPage: {
      title: 'Change Log',
      revLabel: 'Rev.',
      descriptionLabel: 'Change description',
      reasonLabel: 'Reason',
      dateLabel: 'Date',
      reasonPlaceholder: 'Enter reason',
      initialRevDesc: 'Initial document version',
      buttons: {
        add: 'Add revision',
        remove: 'Remove last revision',
        preview: 'Preview change log'
      }
    },

    equipmentPage: {
      title: "Laboratory Equipment",
      nameLabel: "Equipment Name",
      modelLabel: "Model",
      dateLabel: "Calibration Until",
      namePlaceholder: "Enter equipment name",
      modelPlaceholder: "Enter model",
      buttons: {
        add: "Add Equipment",
        preview: "Preview Equipment Sheet"
      }
    },

    documentsPage: {
      title: "Documentation List",
      numberLabel: "Document Number",
      revLabel: "Rev.",
      nameLabel: "Document Title",
      numberPlaceholder: "Enter document number",
      revPlaceholder: "Enter rev.",
      namePlaceholder: "Enter document title",
      buttons: {
        add: "Add Document",
        preview: "Preview Documentation List"
      }
    },

    tolerancesPage: {
      title: "Tolerances",
      paramLabel: "Parameter",
      toleranceLabel: "Tolerance",
      nominalLabel: "Nominal Value",
      unitLabel: "Unit",
      paramPlaceholder: "Enter parameter",
      tolerancePlaceholder: "Select tolerance",
      nominalPlaceholder: "Enter nominal value",
      unitPlaceholder: "Select unit",
      buttons: {
        add: "Add Tolerance",
        preview: "Preview Tolerances List"
      }
    },

    abbreviationsPage: {
      title: "Abbreviations",
      abbrLabel: "Abbreviation",
      descLabel: "Definition",
      abbrPlaceholder: "Select abbreviation",
      descPlaceholder: "Definition",
      buttons: {
        add: "Add Abbreviation",
        preview: "Preview Abbreviations List"
      }
    },
    
    discrepanciesPage: {
      title: "Discrepancy Sheet",
      buttons: {
        goToConstructor: "Go to ATR-Constructor"
      }
    }
  }
};
