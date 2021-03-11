export default {
  success: {
    create: {
      message: 'Successfully new system message has been created!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    delete: {
      message: 'Successfully selected system message has been removed!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    update: {
      message: 'Successfully current system message has been updated!',
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
      message: 'An error occurred during creating a system message!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    delete: {
      message: 'An error occurred during removing the system message!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    update: {
      message: 'An error occurred during updating the system message!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    }
  }
};
