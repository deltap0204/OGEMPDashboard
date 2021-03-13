export default {
  apolloLinks: {
    http: process.env.REACT_APP_APOLLO_HTTP_SERVER,
    ws: process.env.REACT_APP_APOLLO_WS_SERVER
  },
  dev: {
    //    corsHandler:
    //      process.env.NODE_ENV !== 'production'
    //        ? process.env.REACT_APP_CORS_HANDLER
    //        : ''
    corsHandler: process.env.REACT_APP_CORS_HANDLER
  },
  aws: {
    aws_project_region: 'us-east-2',
    aws_cognito_identity_pool_id:
      'us-east-2:e87f7c54-e1c9-4a2d-890f-6b3ebd5d6f1d',
    aws_cognito_region: 'us-east-2',
    aws_user_pools_id: 'us-east-2_HlevK7IPC',
    aws_user_pools_web_client_id: '324uc2rqpj58gdto9p5d18av86',
    oauth: {}
  },
  auth: {
    loginUrl: process.env.REACT_APP_AUTH_COGNITO_URL,
    bottomLogo: process.env.REACT_APP_LOGIN_BOTTOM_LOGO,
    profileImage: process.env.REACT_APP_PROFILE_IMAGE
  },
  signedUrl: {
    endpoint: process.env.REACT_APP_SIGNED_URL_ENDPOINT,
    bucketName: process.env.REACT_APP_BUCKET_NAME
  },
  assetUrl: process.env.REACT_APP_ASSET_URL,
  restful: {
    studentAndTeacherUpload: process.env.REACT_APP_STUDENT_TEACHER_UPLOAD
  }
};
