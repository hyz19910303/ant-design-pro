import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import numeral from 'numeral';
import styles from './DiseaseAnalysis.less';
import { BarLine } from '@/components/Business';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ContentCard = memo(({ loading, children, onChange, ...restProp }) => {
  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs size="large" tabBarStyle={{ marginBottom: 24 }} onChange={key => onChange(key)}>
          {Array.isArray(children) ? (
            children.map((item, index) => {
              const { key } = item;
              let { title } = item.props;

              return (
                <TabPane tab={title} key={key ? key : title}>
                  <Row>
                    <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>{item}</div>
                    </Col>
                  </Row>
                </TabPane>
              );
            })
          ) : (
            <TabPane
              tab={children.props.title}
              key={children.props.key ? children.props : children.props.title}
            >
              <Row>
                <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesBar}>{children}</div>
                </Col>
              </Row>
            </TabPane>
          )}
        </Tabs>
      </div>
    </Card>
  );
});

export default ContentCard;
