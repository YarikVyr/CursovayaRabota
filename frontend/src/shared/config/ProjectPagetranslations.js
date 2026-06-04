export const projectData = {
  aircraftTypes: [
    { id: 'МС-21', name: 'МС-21' },
    { id: 'SSJ-100', name: 'SSJ-100' }
  ],
  trainerTypes: [
    { id: 'Процедурный', name: 'Процедурный' },
    { id: 'Полнопилотажный', name: 'Полнопилотажный' }
  ],
  rmiTypes: [
    { id: 'Встроенное рабочее место', name: 'Встроенное рабочее место' },
    { id: 'Выносное рабочее место', name: 'Выносное рабочее место' }
  ]
};

export const projectTranslations = {
  ru: {
    title: 'АТМ КОНСТРУКТОР',
    logout: 'Выйти',
    searchPlaceholder: 'Поиск',

    tabs: {
      all: 'Все проекты',
      mine: 'Мои проекты',
      trash: 'Корзина'
    },

    project: {
      pageTitle: 'Все проекты',
      allTitle: 'Все проекты',
      mineTitle: 'Мои проекты',
      trashTitle: 'Корзина',
      typeVS: 'Тип ВС',
      trainer: 'Тип тренажера',
      typeRMI: 'Тип РМИ',
      author: 'Автор',
      owner: 'Автор',
      recent: 'Недавно изменен',
      copySuffix: '(копия)',
      empty: 'Проекты не найдены'
    },

    stats: {
      atm: 'ATM',
      ready: 'ГОТОВ',
      work: 'В РАБОТЕ'
    },

    actions: {
      create: 'Создать',
      delete: 'Удалить',
      edit: 'Редактировать',
      restore: 'Восстановить',
      view: 'Посмотреть',
      open: 'Открыть',
      share: 'Поделиться',
      confirm: 'Подтвердить',
      cancel: 'Отмена',
      save: 'Сохранить'
    },

    modals: {
      createTitle: 'Создать проект',
      editTitle: 'Редактировать проект',
      transferTitle: 'Поделиться проектом',
      recipientLabel: 'Логин пользователя:',
      reasonLabel: 'ФИО пользователя:',
      recipientPlaceholder: 'login',
      reasonPlaceholder: 'ФИО',
      loginRequired: 'Поле login обязательно для заполнения',
      userNotFound: 'Ошибка. Пользователь не найден',
      selectVS: 'Тип ВС',
      selectTrainer: 'Тип тренажера',
      selectRMI: 'Тип РМИ',
      namePlaceholder: 'Название проекта',
      deleteTitle: 'Удалить проект?',
      deleteDesc: 'Проект и все ATM внутри будут перенесены в корзину',
      restoreTitle: 'Восстановить проект?',
      restoreDesc: 'Проект и все ATM внутри будут восстановлены',
      duplicateError: 'Создать проект не получится. Такой проект уже есть',
    }
  },

  en: {
    title: 'ATM CONSTRUCTOR',
    logout: 'Logout',
    searchPlaceholder: 'Search',

    tabs: {
      all: 'All Projects',
      mine: 'My Projects',
      trash: 'Trash'
    },

    project: {
      pageTitle: 'All projects',
      allTitle: 'All projects',
      mineTitle: 'My projects',
      trashTitle: 'Trash',
      typeVS: 'A/C Type',
      trainer: 'Trainer',
      typeRMI: 'RMI Type',
      author: 'Creator',
      owner: 'Owner',
      recent: 'Recently modified',
      copySuffix: '(copy)',
      empty: 'No projects found'
    },

    stats: {
      atm: 'ATM',
      ready: 'READY',
      work: 'IN WORK'
    },

    actions: {
      create: 'Create',
      delete: 'Delete',
      edit: 'Edit',
      restore: 'Restore',
      view: 'View',
      open: 'Open',
      share: 'Share',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save'
    },

    modals: {
      createTitle: 'Create project',
      editTitle: 'Edit Project',
      transferTitle: 'Share Project',
      recipientLabel: 'User login:',
      reasonLabel: 'Full Name:',
      recipientPlaceholder: 'login',
      loginRequired: 'The login field is required',
      userNotFound: 'Error. User not found',
      reasonPlaceholder: 'Full Name',
      selectVS: 'Select A/C Type',
      selectTrainer: 'Select Trainer Type',
      selectRMI: 'Select RMI Type',
      namePlaceholder: 'Project Name',
      deleteTitle: 'Delete project?',
      deleteDesc: 'The project and all ATMs inside will be moved to the trash',
      restoreTitle: 'Restore project?',
      restoreDesc: 'The project and all ATMs inside will be restored',
      duplicateError: 'Cannot create project. This project name already exists',
    }
  }
};
