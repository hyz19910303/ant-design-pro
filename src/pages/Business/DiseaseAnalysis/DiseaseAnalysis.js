import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';

// import { BaseBox, TextBox, ChartBox } from '@/components/Business/Box';
// import {  BaseLine, BasePie, Bar, RingPie, MultiLine } from '@/components/Business/Chart';
// import SearchBar from '../Homepage/SearchBar';
import styles from './DiseaseAnalysis.less';
const DiseaseCard = React.lazy(() => import('./DiseaseCard'));

// @connect(state => ({
//   supplier: state.diseaseAnalysisModel,
// }))
@connect(({ diseaseAnalysisModel, loading }) => ({
  diseaseAnalysisModel,
  loading: loading.models.diseaseAnalysisModel
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
      type:'diseaseAnalysisModel/fetchSubAvgCostTrendAndRate',
      payload:{
        beginTime:2017,
        endTime: 2017,
        timeType: 4,
        org_codes:'44488501443010511A1001'
      }
    });
  }

  componentWillUnmount() {

  }

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

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { diseaseAnalysisModel, loading } = this.props;
    
    const {
      visitData,
      visitData2,
      salesData=[],
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
      rangePickerValue=[],
      selectDate=[],
      avgOutPatientEmergencyCost=[],
    } = diseaseAnalysisModel;

    

    return (
      <GridContent>
        <Suspense fallback={null}>
          <DiseaseCard
            rangePickerValue={rangePickerValue}
            salesData={avgOutPatientEmergencyCost}
            isActive={this.isActive}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
        <Suspense fallback={null}>
          <DiseaseCard
            rangePickerValue={rangePickerValue}
            salesData={salesData}
            isActive={this.isActive}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default DiseaseAnalysis;
