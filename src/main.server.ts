import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

<<<<<<< HEAD
const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);
=======
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);
>>>>>>> 6b90232a27f4eeea189f024c3e05bea0349def92

export default bootstrap;
