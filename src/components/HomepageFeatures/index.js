import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Real-time Blockchain Data',
    // Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
       Get access to real-time blockchain data through the GraphQL subscriptions.
      </>
    ),
  },
  {
    title: 'GraphQL API',
    // Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Access tokens transfers, DEX Trades, NFTs, and other data through Bitquery GraphQL APIs.
      </>
    ),
  },
  {
    title: 'Cloud Data Sets',
    // Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Access to blockchain data through cloud infra such as AWS S3, Microsoft Azure, Snowflake, Google BigQuery, etc.      </>
    ),
  },
  {
    title: 'Blockchain Traces',
    // Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Trace every transaction in detail without the need to manage your own archive nodes. </>
    ),
  },
  {
    title: 'Mempool Information',
    // Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Capture all broadcasted transactions to obtain real-time data for easy transaction simulation.

</>
    ),
  },
  {
    title: 'DeFi APIs',
    // Svg: require('@site/static/img/BitqueryBW.svg').default,
    description: (
      <>
Explore DEX trades, LPs, DAOs, lending, and borrowing info across different networks.
</>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
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
