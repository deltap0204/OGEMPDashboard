export default {
  success: {
    create: {
      message: 'Successfully new station has been created!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    delete: {
      message: 'Successfully new station has been removed!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    },
    update: {
      message: 'Successfully current station has been updated!',
      options: {
        autoHideDuration: 3000,
        variant: 'success'
      }
    }
  },
  info: {},
  warning: {},
  error: {
    create: {
      message: 'An error occurred during creating a new station!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    delete: {
      message: 'An error occurred during removing the station!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    },
    update: {
      message: 'An error occurred during updating the station!',
      options: {
        autoHideDuration: 3000,
        variant: 'error'
      }
    }
  }
};
