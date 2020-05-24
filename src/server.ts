import app from './app';

app.listen(process.env.HTTP_PORT || 3000, ():
  void => console.info(`(${process.env.NODE_ENV}) http://0.0.0.0:${process.env.HTTP_PORT}`));
