import React, { ComponentProps } from 'react';
import {
  Typography,
  Grid,
  LinearProgress,
  IconButton,
  makeStyles,
  Divider,
  Box,
} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import {
  InfoCard,
  ErrorBoundary,
  OverflowTooltip,
} from '@backstage/core-components';
import {
  MissingAnnotationEmptyState,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  AboutField,
  AppStatusIndicator,
  useAppOverview,
} from '@cosmonic/backstage-plugin-wasmcloud-react';
import { WASMCLOUD_ANNOTATION } from '@cosmonic/backstage-plugin-wasmcloud-common';
import { ApplicationOverview } from '@cosmonic/backstage-plugin-wasmcloud-react';
import { isWasmCloudAvailable } from '../conditions';

const CARD_TITLE = 'wasmCloud Overview';

function MainCard(props: ComponentProps<typeof InfoCard>) {
  return <InfoCard title={CARD_TITLE} {...props} />;
}

const useStyles = makeStyles(theme => ({
  value: {
    fontWeight: 'bold',
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

function AppOverviewSection({ app }: { app: ApplicationOverview }) {
  const classes = useStyles();

  return (
    <Grid container>
      <AboutField label="Name" gridSizes={{ xs: 12 }}>
        <Typography variant="body2" className={classes.value}>
          {app.summary.name}
        </Typography>
      </AboutField>
      <AboutField
        label="State" // Pending | Active | Inactive | Failed
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        <Typography variant="body2" className={classes.value}>
          <AppStatusIndicator status={app.summary.status} />
        </Typography>
      </AboutField>
      <AboutField label="Version" gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
        <Typography variant="body2" className={classes.value}>
          <OverflowTooltip text={app.summary.version} />
        </Typography>
      </AboutField>
      <AboutField label="History" gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
        <Typography variant="body2" className={classes.value}>
          {app.versions.length} Version{app.versions.length === 1 ? '' : 's'}
        </Typography>
      </AboutField>
    </Grid>
  );
}

function WasmCloudOverview() {
  const { loading, value, error, retry } = useAppOverview();

  if (loading) {
    return (
      <MainCard>
        <LinearProgress />
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard>Error fetching Application Overview: {error.message}</MainCard>
    );
  }

  const apps = value ?? [];

  return (
    <MainCard
      action={
        <IconButton aria-label="Edit" title="Edit Metadata" onClick={retry}>
          <SyncIcon />
        </IconButton>
      }
    >
      {apps.map((app, index) => (
        <>
          {index >= 1 && <Box my={2.5} mx={-2} children={<Divider />} />}
          <AppOverviewSection app={app} />
        </>
      ))}
    </MainCard>
  );
}

export function WasmCloudOverviewCard() {
  const { entity } = useEntity();

  if (!isWasmCloudAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={WASMCLOUD_ANNOTATION} />;
  }

  return (
    <ErrorBoundary>
      <WasmCloudOverview />
    </ErrorBoundary>
  );
}
