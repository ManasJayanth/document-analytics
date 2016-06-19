const actions = require('../action-constants');
const Immutable = require('immutable');

module.exports = (currentState = Immutable.List.of(), action) => {
  switch (action.type) {
    case actions.fields.ADD:
      const ifield = Immutable.Map(action.data);
      ifield.options = Immutable.List.of();
      return currentState.push(ifield);
      break;
    case actions.fields.REMOVE:
      const position = currentState.indexOf(Immutable.Map(action.data));
      return currentState.delete(position);
      break;
    case actions.fields.UPDATE:
      const currentStateCopy = currentState.update(
        currentState.indexOf(
          Immutable.Map(action.data.oldData)
        ),
        value => Immutable.Map(action.data.newData)
      );
      return currentStateCopy;
      break;
    case actions.options.ADD:
      const parentFieldName = action.data.parent;
      const option = Immutable.Map(action.data).delete('parent');
      const targetField = currentState.filter(f => f.get('name') === parentFieldName).get(0);
      return currentState.update(
        currentState.indexOf(
          targetField
        ),
        field => field.update(
          'options',
          options => options.concat([option.toObject()])
        )
      );
      break;
    default:
      return currentState;
  }
}
