export default {
  success: {
    create: {
      message: 'Successfully new state has been added!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    delete: {
      message: 'Successfully selected state has been removed!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    update: {
      message: 'Successfully current state has been updated!',
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
      message: 'An error occurred during creating a state!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    delete: {
      message: 'An error occurred during removing the state!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    update: {
      message: 'An error occurred during updating the state!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    }
  }
};
