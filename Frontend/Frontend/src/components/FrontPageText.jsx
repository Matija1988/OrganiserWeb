import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './FrontPageText.css';

function ContainerExample() {
  return (
    <Container>
      <Row>
        <Col className='FrontPageText'>C-project</Col>
      </Row>
      <Row>
        <Col className='FrontPageTextMarketingBS'>Launch your projects into cyberspace</Col>
      </Row>
    </Container>
  );
}

export default ContainerExample;