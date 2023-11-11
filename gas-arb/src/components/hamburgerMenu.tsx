import "@radix-ui/themes/styles.css";
import {Theme, Button, DropdownMenu } from "@radix-ui/themes";
import { FaBars } from "react-icons/fa6";
type HamburgerMenuProps = {
  numberBlocker: number;
};

export default function HamburgerMenu({ numberBlocker }: HamburgerMenuProps) {
  return (
    <Theme>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button color="indigo">
            <FaBars />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onClick={() => numberBlocker != 1 && (window.location.href = "/")}
            style={numberBlocker == 1 ? { backgroundColor: "#E0E0E0" } : {}}
          >
            Main Page
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => numberBlocker != 2 && (window.location.href = "/testingBoard")}
            style={numberBlocker == 2 ? { backgroundColor: "#E0E0E0" } : {}}
          >Testing Board</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );
}
