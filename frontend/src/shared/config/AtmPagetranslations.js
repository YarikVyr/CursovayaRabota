export const atmProjectData = {
  ataCodes: [
    {
      id: '21',
      name: '21 - Air Conditioning',
      systemName: 'Air Conditioning',
      subsystems: [
        { id: '21-10', name: '21-10 - Compression' },
      ]
    },
    {
      id: '22',
      name: '22 - Auto Flight',
      systemName: 'Auto Flight',
      subsystems: [
        { id: '22-10', name: '22-10 - Autopilot' }
      ]
    },
    {
      id: '24',
      name: '24 - Electrical Power',
      systemName: 'Electrical Power',
      subsystems: []
    },
    {
      id: '27',
      name: '27 - Flight Controls',
      systemName: 'Flight Controls',
      subsystems: []
    },
  ],
  fstdCodes: [
    {
      id: 'A',
      name: 'A - General',
      systemName: 'General',
      subsystems: [
        { id: 'A1', name: 'A1 - Objective Tests' }
      ]
    },
    { id: 'B', name: 'B - Performance', systemName: 'Performance', subsystems: [] },
    { id: 'C', name: 'C - Handling', systemName: 'Handling', subsystems: [] },
    { id: 'D', name: 'D - Systems', systemName: 'Systems', subsystems: [] },
    { id: 'E', name: 'E - Equipment', systemName: 'Equipment', subsystems: [] }
  ]
};

export const atmTranslations = {
  RU: {
    title: 'АТМ КОНСТРУКТОР',
    placeholder: 'Поиск',
    edit: 'Редактировать',
    recent: 'Недавно изменен',

    fields: {
      ata: 'ATA',
      fstd: 'FSTD',
      subsystem: 'Название подсистемы',
      author: 'Автор',
      rev: 'Rev.'
    },

    tabs: {
      all: 'Все',
      draft: 'Черновики',
      process: 'В работе',
      review: 'На проверке',
      ready: 'Готово',
      trash: 'Корзина'
    },

    statuses: {
      draft: 'Черновик',
      process: 'В работе',
      review: 'На проверке',
      ready: 'Готов'
    },

    modals: {
      createTitle: 'Создать ATM',
      editTitle: 'Редактировать ATM',
      codeAta: 'Код ATA',
      codeFstd: 'Код FSTD',
      systemName: 'Название системы',
      subsystemName: 'Название подсистемы',
      save: 'Сохранить',
      create: 'Создать',
      deleteTitle: 'Удалить ATM?',
      deleteDesc: 'ATM и все его содержимое будет перенесено в корзину',
      restoreTitle: 'Восстановить ATM?',
      restoreDesc: 'ATM и все его содержимое будет восстановлено'
    },

    actions: {
      delete: 'Удалить',
      restore: 'Восстановить',
      cancel: 'Отмена',
      view: 'Посмотреть'
    }
  },

  EN: {
    title: 'ATM CONSTRUCTOR',
    placeholder: 'Search',
    edit: 'Edit',
    recent: 'Recently modified',

    fields: {
      ata: 'ATA',
      fstd: 'FSTD',
      subsystem: 'Subsystem Name',
      author: 'Author',
      rev: 'Rev.'
    },

    tabs: {
      all: 'All',
      draft: 'Drafts',
      process: 'In progress',
      review: 'In review',
      ready: 'Ready',
      trash: 'Trash'
    },

    statuses: {
      draft: 'Draft',
      process: 'In progress',
      review: 'On review',
      ready: 'Ready'
    },

    modals: {
      createTitle: 'Create ATM',
      editTitle: 'Edit ATM',
      codeAta: 'ATA code',
      codeFstd: 'FSTD code',
      systemName: 'System Name',
      subsystemName: 'Subsystem Name',
      save: 'Save',
      create: 'Create',
      deleteTitle: 'Delete ATM?',
      deleteDesc: 'The ATM and all its contents will be moved to the trash',
      restoreTitle: 'Restore ATM?',
      restoreDesc: 'The ATM and all its contents will be restored'
    },

    actions: {
      delete: 'Delete',
      restore: 'Restore',
      cancel: 'Cancel',
      view: 'View'
    }
  }
};
