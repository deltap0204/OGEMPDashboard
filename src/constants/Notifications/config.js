export default {
  success: {
    create: {
      message: 'Successfully new configuration has been created!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    delete: {
      message: 'Successfully selected configuration has been removed!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    update: {
      message: 'Successfully current configuration has been updated!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    }
  },
  info: {},
  warning: {
    delete: {
      message: 'We cant take this action for now. Please check the checkbox!',
      options: {
        autoHideDuration: 3000,
        variant: 'warning'
      }
    }
  },
  error: {
    create: {
      message: 'An error occurred during creating a configuration!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    delete: {
      message: 'An error occurred during removing the configuration!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    update: {
      message: 'An error occurred during updating the configuration!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    }
  }
};
