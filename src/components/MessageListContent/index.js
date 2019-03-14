import React from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import styles from './index.less';

const MessageListContent = ({ data: { content, create_time, avatar, issuer,  } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{content}</div>
    <div className={styles.extra}>
      <a href='javascript:void(0)'>{issuer}</a> 在{moment(create_time).format('YYYY-MM-DD HH:mm')}发布
      {/*<em>{moment(create_time).format('YYYY-MM-DD HH:mm')}</em>*/}
    </div>
  </div>
);

export default MessageListContent;
