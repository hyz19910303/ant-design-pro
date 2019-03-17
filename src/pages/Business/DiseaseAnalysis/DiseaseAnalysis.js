import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown,Card,  } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getTimeDistance } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';
import { BarLine } from '@/components/Business';


import SearchTool from '../SearchTool';

import styles from './DiseaseAnalysis.less';

const ContentCard = React.lazy(() => import('./ContentCard'));

// @connect(state => ({
//   supplier: state.diseaseAnalysisModel,
// }))
@connect(({ diseaseAnalysisModel, loading }) => ({
  diseaseAnalysisModel,
  loading: loading.models.diseaseAnalysisModel,
}))

class DiseaseAnalysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'diseaseAnalysisModel/fetchSubAvgCastData',
      payload: {
        beginTime: 2017,
        endTime: 2017,
        timeType: 4,
        org_codes: '44488501443010511A1001',
      },
    });
  }

  componentWillUnmount() {}

  onSearch(params) {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    dispatch({
      type: 'diseaseAnalysisModel/fetchDiseasePersonTime',
      payload: {
        ...params,
      },
    }).then(() => this.setState({ loading: false }));
    dispatch({
      type: 'diseaseAnalysisModel/fetchDiseaseRegisteredType',
      payload: {
        ...params,
      },
    }).then(() => this.setState({ loading: false }));
  }

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'diseaseAnalysisModel/fetchSalesData',
    });
  };

  changeTab = key => {
    console.log(key)
  };


  

  

  render() {
    const { diseaseAnalysisModel, loading } = this.props;

    const { subAvgCastBarData = [] } = diseaseAnalysisModel;

    const Bar = () => (
      <BarLine
        height={295}
        title={'销售额度'}
        data={subAvgCastBarData}
        color={'bus_name'}
        x={'bus_date'}
        y={'bus_value'}
        types={['intervalDodge']}
      />
    );

    return (
      <PageHeaderWrapper title="疾病分析">
        <GridContent>
          <SearchTool  />
          <Suspense fallback={null}>
            <ContentCard loading={loading} onChange={key => this.changeTab(key)}>
              <Bar title={'销售额'} />
            </ContentCard>
            <ContentCard loading={loading} onChange={key => this.changeTab(key)}>
              <Bar title={'销售额'} key="goods" />
              <Bar title={'进货价'} key="starf" />
            </ContentCard>
          </Suspense>
          <Suspense fallback={null} />
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default DiseaseAnalysis;
