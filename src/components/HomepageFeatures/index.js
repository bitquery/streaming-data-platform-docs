import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Real time blockchain data',
    Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
       Get access to real-time (without delay) blockchain data through the GraphQL subscription (WebSocket).
      </>
    ),
  },
  {
    title: 'GraphQL API',
    Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Access tokens transfers, trades, NFTs, and other historical data through Bitquery GraphQL APIs, including mempool data.
      </>
    ),
  },
  {
    title: 'Cloud Data Sets',
    Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Access to blockchain data through cloud infra such as AWS S3, Microsoft Azure, Snowflake, Google BigQuery, etc.      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
