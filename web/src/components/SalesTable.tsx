
type Data = {
  name: string;
  value: number;
};

type Props = {
  data: Data[];
};

const SalesTable: React.FC<Props> = ({data}) => {
  return (
    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto'}}>
      <table className="table align-middle">
        <thead>
          <tr>
            <td>Name</td>
            <td width='20%'>Sales in $</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td className="text-dark fw-semibold" style={{ background: '#d9f0f6'}}>{item.name}</td>
                <td  style={{
                      backgroundColor: "#b2ebf2",
                    }}>
                  <div
                    className="d-flex align-items-center"
                  
                  >
                    ${item.value}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
