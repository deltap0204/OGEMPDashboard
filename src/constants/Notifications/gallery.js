export default {
  success: {
    create: {
      message: 'Successfully new gallery has been added!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    delete: {
      message: 'Successfully selected gallery has been removed!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    update: {
      message: 'Successfully current gallery has been updated!',
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
      message: 'An error occurred during creating a gallery!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    delete: {
      message: 'An error occurred during removing the gallery!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    update: {
      message: 'An error occurred during updating the gallery!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    }
  }
};
