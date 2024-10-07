import React from 'react';
import { Grid, LinearProgress } from '@material-ui/core';
import {
  InfoCard,
  ContentHeader,
  OverflowTooltip,
} from '@backstage/core-components';
import {
  useAppOverview,
  AboutField,
  AppStatusIndicator,
} from '@cosmonic/backstage-plugin-wasmcloud-react';

export const WasmCloudDetailsPage = () => {
  const { loading, value } = useAppOverview();

  const apps = value ?? [];

  return (
    <>
      <ContentHeader title="wasmCloud Applications" />
      <Grid container spacing={3} direction="column">
        {loading ? (
          <LinearProgress />
        ) : (
          apps.map(app => {
            return (
              <Grid item>
                <InfoCard title={app.summary.name}>
                  <Grid container>
                    <AboutField label="Description" gridSizes={{ xs: 12 }}>
                      <span>{app.summary.description}</span>
                    </AboutField>
                    <AboutField
                      label="State" // Pending | Active | Inactive | Failed
                      gridSizes={{ xs: 12, sm: 6, md: 4 }}
                    >
                      <AppStatusIndicator status={app.summary.status} />
                    </AboutField>
                    <AboutField
                      label="Version"
                      gridSizes={{ xs: 12, sm: 6, md: 4 }}
                    >
                      <OverflowTooltip text={app.summary.version} />
                    </AboutField>
                    <AboutField
                      label="History"
                      gridSizes={{ xs: 12, sm: 6, md: 4 }}
                    >
                      <span>
                        {app.versions.length} Version
                        {app.versions.length === 1 ? '' : 's'}
                      </span>
                    </AboutField>
                  </Grid>
                </InfoCard>
              </Grid>
            );
          })
        )}
      </Grid>
    </>
  );
};
