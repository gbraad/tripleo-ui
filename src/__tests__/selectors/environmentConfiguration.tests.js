import { List, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/environmentConfiguration';
import { EnvironmentConfigurationState } from '../../js/immutableRecords/environmentConfiguration';

describe('Environment Configuration selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const state = {
    environmentConfiguration: new EnvironmentConfigurationState({
      loaded: true,
      isFetching: false,
      topics: Map({
        Topic1: Map({
          title: 'Topic1',
          environment_groups: List(['Group1'])
        })
      }),
      environmentGroups: Map({
        Group1: Map({
          title: 'Group1',
          description: 'Group1 description',
          environments: List(['environments/environment1.yaml','environments/environment2.yaml'])
        })
      }),
      environments: Map({
        'environments/environment1.yaml': Map({
          file: 'environments/environment1.yaml',
          title: 'Environment1',
          enabled: true
        }),
        'environments/environment2.yaml': Map({
          title: 'Environment2',
          file: 'environments/environment2.yaml',
          enabled: false
        })
      }),
      form: Map({
        formErrors: List(),
        formFieldErrors: Map()
      })
    })
  };

  it('provides selector to get enabled environments', () => {
    expect(selectors.getEnabledEnvironments(state)).toEqualImmutable(Map({
      'environments/environment1.yaml': Map({
        file: 'environments/environment1.yaml',
        title: 'Environment1',
        enabled: true
      })
    }));
  });

  it('provides selector to get environment configuration summary string', () => {
    expect(selectors.getEnvironmentConfigurationSummary(state)).toEqual('Environment1');
  });

  it(`provides selector to get nested tree of Environment Configuration Topics,
      Environment Groups and Environments`, () => {
    expect(selectors.getTopicsTree(state)).toEqualImmutable(Map({
      Topic1: Map({
        title: 'Topic1',
        environment_groups: List([
          Map({
            title: 'Group1',
            description: 'Group1 description',
            environments: List([
              Map({
                file: 'environments/environment1.yaml',
                title: 'Environment1',
                enabled: true
              }),
              Map({
                title: 'Environment2',
                file: 'environments/environment2.yaml',
                enabled: false
              })
            ])
          })
        ])
      })
    }));
  });
});
