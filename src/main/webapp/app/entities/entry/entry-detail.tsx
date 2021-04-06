import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './entry.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEntryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EntryDetail = (props: IEntryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { entryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="entryDetailsHeading">
          <Translate contentKey="blogApp.entry.detail.title">Entry</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{entryEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="blogApp.entry.title">Title</Translate>
            </span>
          </dt>
          <dd>{entryEntity.title}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="blogApp.entry.content">Content</Translate>
            </span>
          </dt>
          <dd>{entryEntity.content}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="blogApp.entry.date">Date</Translate>
            </span>
          </dt>
          <dd>{entryEntity.date ? <TextFormat value={entryEntity.date} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="blogApp.entry.blog">Blog</Translate>
          </dt>
          <dd>{entryEntity.blog ? entryEntity.blog.name : ''}</dd>
          <dt>
            <Translate contentKey="blogApp.entry.tag">Tag</Translate>
          </dt>
          <dd>
            {entryEntity.tags
              ? entryEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {entryEntity.tags && i === entryEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/entry" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entry/${entryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ entry }: IRootState) => ({
  entryEntity: entry.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
