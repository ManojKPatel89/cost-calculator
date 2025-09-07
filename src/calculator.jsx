import Button from "react-bootstrap/Button";
import { Card, Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useRef } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";

let playerOptions = [
  { name: "Manoj", isMember: true, isOther: false, amount: 0 },
  { name: "Chinmaya", isMember: true, isOther: false, amount: 0 },
  { name: "Satya", isMember: true, isOther: false, amount: 0 },
  { name: "Paramesh", isMember: true, isOther: false, amount: 0 },
  { name: "Harish", isMember: false, isOther: true, amount: 0 },
];

function resetPlayerOptions() {
  playerOptions.length = 0;
  playerOptions = [
    { name: "Manoj", isMember: true, isOther: false, amount: 0 },
    { name: "Chinmaya", isMember: true, isOther: false, amount: 0 },
    { name: "Satya", isMember: true, isOther: false, amount: 0 },
    { name: "Paramesh", isMember: true, isOther: false, amount: 0 },
    { name: "Harish", isMember: false, isOther: true, amount: 0 },
  ];
}

export default function CostCalculator() {
  const hoursPlayedRef = useRef();
  const courtCostRef = useRef();
  const shuttleUsed = useRef();
  const shuttleCostRef = useRef();
  const checkboxRefs = useRef([]);
  const otherPlayersRef = useRef();
  const resultRef = useRef(null);

  const defaultValues = useRef({
    hoursPlayed: 1,
    courtCost: 250,
    shuttleUsed: 1,
    shuttleCost: 200,
    checkboxRefs: [],
    otherPlayersCount: 0,
  });

  const handleReset = () => {
    // Manually reset each field to default value
    resetPlayerOptions();
    hoursPlayedRef.current.value = defaultValues.current.hoursPlayed;
    courtCostRef.current.value = defaultValues.current.courtCost;
    shuttleUsed.current.value = defaultValues.current.shuttleUsed;
    shuttleCostRef.current.value = defaultValues.current.shuttleCost;
    otherPlayersRef.current.value = defaultValues.current.otherPlayersCount;

    checkboxRefs.current.forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });

    if (resultRef.current) {
      resultRef.current.innerText = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    resetPlayerOptions();

    let extraCollection = 0;
    const hourlyRefund = 25;

    // const totalCollection = 0;
    const othersPlayed = otherPlayersRef.current.value;
    const membersPlayed = checkboxRefs.current.filter(
      (checkbox) => checkbox && checkbox.checked
    ).length;

    const totalPermMembers = playerOptions.filter(
      (player) => player.isMember
    ).length;

    const totalPlayed = +othersPlayed + +membersPlayed;

    const courtCost = hoursPlayedRef.current.value * courtCostRef.current.value;

    let perCourtCost = courtCost / totalPlayed;
    let totalRefund = hoursPlayedRef.current.value * hourlyRefund;

    const shuttleCost =
      shuttleUsed.current.value * shuttleCostRef.current.value;

    let perShuttleCost = shuttleCost / totalPlayed;

    playerOptions.forEach((player, index) => {
      const checkbox = checkboxRefs.current[index];
      if (checkbox && checkbox.checked) {
        player.amount = player.amount + perShuttleCost;
      }
    });

    if (othersPlayed > 0) {
      extraCollection = +othersPlayed * perCourtCost;

      playerOptions.forEach((player, index) => {
        const checkbox = checkboxRefs.current[index];
        if (checkbox && !checkbox.checked && player.isMember) {
          const amount = totalRefund;
          extraCollection = extraCollection - amount;
          player.amount = player.amount - amount;
        }
      });

      const perMemRefund = extraCollection / totalPermMembers;

      playerOptions.forEach((player) => {
        if (player.isMember) {
          player.amount = player.amount - perMemRefund;
        }
      });

      let othersC = 0;
      while (othersC < othersPlayed) {
        const on = "Extra " + (+othersC + 1);
        const extra = {
          name: on,
          isMember: false,
          isOther: false,
          amount: perCourtCost + perShuttleCost,
        };
        playerOptions.push(extra);
        othersC++;
      }
    }

    if (resultRef.current) {
      if (membersPlayed === 0) {
        resultRef.current.innerHTML =
          '<div class="alert alert-warning">No players selected.</div>';
        return;
      }

      // Generate result table HTML
      const rows = playerOptions
        .map(
          (player) => `
            <tr>
              <td>${player.name}</td>
              <td>${player.amount}</td>
            </tr>
          `
        )
        .join("");

      resultRef.current.innerHTML = `
        <h5 class="mt-4">Summary</h5>
        <p>Per court cost : ${perCourtCost}</p>
        <p>Per shuttle cost : ${perShuttleCost}</p>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }
  };

  return (
    <Container>
      <h1>Game cost split</h1>
      <Card className="mb-3">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Hours played">
                    <Form.Select
                      ref={hoursPlayedRef}
                      defaultValue={defaultValues.current.hoursPlayed}
                    >
                      <option value=".5">.5</option>
                      <option value="1">1</option>
                      <option value="1.5">1.5</option>
                      <option value="2">2</option>
                      <option value="2.5">2.5</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Court cost">
                    <Form.Control
                      type="text"
                      placeholder="Enter cost"
                      defaultValue={250}
                      ref={courtCostRef}
                    />
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Shuttle used">
                    <Form.Select
                      ref={shuttleUsed}
                      defaultValue={defaultValues.current.shuttleUsed}
                    >
                      <option value=".5">half</option>
                      <option value="1">full</option>
                      <option value="0">not used</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Shuttle cost">
                    <Form.Control
                      type="text"
                      placeholder="Enter cost"
                      defaultValue={defaultValues.current.shuttleCost}
                      ref={shuttleCostRef}
                    />
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            <p>Players played :</p>
            <Row>
              <Col>
                {playerOptions.map((player, index) => (
                  <Form.Check
                    type="checkbox"
                    key={player.name}
                    label={player.name}
                    ref={(el) => (checkboxRefs.current[index] = el)}
                  />
                ))}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="No of other players">
                    <Form.Select
                      ref={otherPlayersRef}
                      defaultValue={defaultValues.current.otherPlayersCount}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div id="result" ref={resultRef} className="mt-4" />
    </Container>
  );
}
