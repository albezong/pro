import profile from 'app/entities/profile/profile.reducer';
import modulePermission from 'app/entities/module-permission/module-permission.reducer';
import modules from 'app/entities/modules/modules.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  profile,
  modulePermission,
  modules,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
