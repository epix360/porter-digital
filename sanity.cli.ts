import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId } from './src/sanity/env';

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: undefined, // set per-project for hosted studio, e.g. 'my-client'
});
