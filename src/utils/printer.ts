// ESC/POS printer commands
export class ESCPOSPrinter {
  private device: USBDevice | null = null;
  private encoder: TextEncoder;

  constructor() {
    this.encoder = new TextEncoder();
  }

  // Initialize printer
  async connect(): Promise<boolean> {
    try {
      this.device = await navigator.usb.requestDevice({
        filters: []
      });

      await this.device.open();
      await this.device.selectConfiguration(1);
      await this.device.claimInterface(0);

      return true;
    } catch (error) {
      console.error('Printer connection error:', error);
      return false;
    }
  }

  // Disconnect printer
  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.device.releaseInterface(0);
        await this.device.close();
      } catch (error) {
        console.error('Printer disconnect error:', error);
      }
      this.device = null;
    }
  }

  // Send command to printer
  private async sendCommand(command: string): Promise<void> {
    if (!this.device) {
      throw new Error('Printer not connected');
    }

    const data = this.encoder.encode(command);
    await this.device.transferOut(1, data);
  }

  // Initialize printer
  async init(): Promise<void> {
    await this.sendCommand('\x1b\x40'); // ESC @
  }

  // Set text alignment
  async setAlign(align: 'left' | 'center' | 'right'): Promise<void> {
    const commands: Record<string, string> = {
      left: '\x1b\x61\x30', // ESC a 0
      center: '\x1b\x61\x31', // ESC a 1
      right: '\x1b\x61\x32' // ESC a 2
    };
    await this.sendCommand(commands[align] || commands.left);
  }

  // Set text size
  async setTextSize(width: number = 1, height: number = 1): Promise<void> {
    const size = ((width - 1) << 4) | (height - 1);
    await this.sendCommand(`\x1d\x21${String.fromCharCode(size)}`); // GS ! n
  }

  // Set bold
  async setBold(bold: boolean): Promise<void> {
    await this.sendCommand(bold ? '\x1b\x45\x01' : '\x1b\x45\x00'); // ESC E
  }

  // Print text
  async printText(text: string): Promise<void> {
    await this.sendCommand(text);
  }

  // Print line
  async printLine(text: string): Promise<void> {
    await this.printText(text + '\n');
  }

  // Print separator line
  async printSeparator(char: string = '-'): Promise<void> {
    await this.printLine(char.repeat(32));
  }

  // Feed lines
  async feedLines(lines: number): Promise<void> {
    await this.sendCommand(`\x1b\x64${String.fromCharCode(lines)}`); // ESC d
  }

  // Cut paper
  async cut(): Promise<void> {
    await this.sendCommand('\x1d\x56\x00'); // GS V 0
  }

  // Print receipt
  async printReceipt(receipt: {
    shopName: string;
    address?: string;
    phone?: string;
    invoiceNo: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: string;
    customerName?: string;
    footer?: string;
  }): Promise<void> {
    await this.init();
    await this.setAlign('center');
    await this.setTextSize(2, 2);
    await this.setBold(true);
    await this.printLine(receipt.shopName);
    await this.setBold(false);
    await this.setTextSize(1, 1);

    if (receipt.address) {
      await this.printLine(receipt.address);
    }
    if (receipt.phone) {
      await this.printLine(receipt.phone);
    }

    await this.feedLines(1);
    await this.setAlign('left');
    await this.printSeparator();
    await this.printLine(`Invoice: ${receipt.invoiceNo}`);
    await this.printLine(`Date: ${receipt.date}`);
    if (receipt.customerName) {
      await this.printLine(`Customer: ${receipt.customerName}`);
    }
    await this.printSeparator();

    // Print items
    for (const item of receipt.items) {
      const name = item.name.substring(0, 20).padEnd(20);
      const qty = item.quantity.toString().padStart(3);
      const price = item.price.toFixed(2).padStart(8);
      const subtotal = item.subtotal.toFixed(2).padStart(10);
      await this.printLine(`${name} ${qty}x${price}`);
      await this.printLine(`                    ${subtotal}`);
    }

    await this.printSeparator();
    const subtotalStr = receipt.subtotal.toFixed(2).padStart(20);
    await this.printLine(`Subtotal: ${subtotalStr}`);
    if (receipt.discount > 0) {
      const discountStr = receipt.discount.toFixed(2).padStart(20);
      await this.printLine(`Discount: ${discountStr}`);
    }
    if (receipt.tax > 0) {
      const taxStr = receipt.tax.toFixed(2).padStart(20);
      await this.printLine(`Tax: ${taxStr}`);
    }
    await this.setBold(true);
    const totalStr = receipt.total.toFixed(2).padStart(20);
    await this.printLine(`Total: ${totalStr}`);
    await this.setBold(false);
    await this.printLine(`Payment: ${receipt.paymentMethod}`);
    await this.feedLines(2);

    if (receipt.footer) {
      await this.setAlign('center');
      await this.printLine(receipt.footer);
    }

    await this.feedLines(3);
    await this.cut();
  }
}

// Export singleton instance
export const printer = new ESCPOSPrinter();

