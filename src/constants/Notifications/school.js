export default {
  success: {
    create: {
      message: 'Successfully new school has been created!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    delete: {
      message: 'Successfully selected school has been removed!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    update: {
      message: 'Successfully current school has been updated!',
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
      message: 'An error occurred during creating a school!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    delete: {
      message: 'An error occurred during removing the school!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    update: {
      message: 'An error occurred during updating the school!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    }
  }
};
