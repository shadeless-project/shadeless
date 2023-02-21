import { Spinner, Tag, Tooltip } from "@chakra-ui/react";
import React from "react";
import { DashboardPackets, defaultDashboardPacket, getDashboardPackets } from "src/libs/apis/packets";
import { defaultQuery2ObjectResult } from "src/libs/query.parser";

type ProjectStatProps = {
  projectName: string;
}
export default function ProjectStat (props: ProjectStatProps) {
  const { projectName } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState<DashboardPackets>(defaultDashboardPacket);

  React.useEffect(() => {
    async function getProjectStat() {
      setIsLoading(true);
      const resp = await getDashboardPackets(projectName, defaultQuery2ObjectResult);
      setIsLoading(false);
      setStats(resp.data);
    }
    getProjectStat();
  }, [projectName]);

  return (
    <React.Fragment>
      {isLoading ? <Spinner /> :
        <React.Fragment>
          <Tooltip placement="top" fontSize="2xs" label="Number of origins">
            <Tag colorScheme='blue' borderRadius='full'>
              {stats.numAllOrigins}
            </Tag>
          </Tooltip>
          <Tooltip placement="top" fontSize="2xs" label="Number of packets">
            <Tag bg="custom.black" color="custom.white" borderRadius='full' mx="2px">
              {stats.numAllPackets}
            </Tag>
          </Tooltip>
        </React.Fragment>
      }
    </React.Fragment>
  );
}
